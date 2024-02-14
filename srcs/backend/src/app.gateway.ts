import { GameService } from './game/game.service';
import { UsersService } from 'src/users/users.service';
import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationType, Status } from '@prisma/client';
import { ChatService } from 'src/users/chat/chat.service';
import { MessageService } from 'src/users/chat/message/message.service';
import { WsAuthenticatedGuard } from './common/guards/ws.guard';
import { CreateChatDto } from './users/chat/dto/create-chat.dto';
import { UserType } from './common/interfaces/user.interface';

interface MessagePayload {
  room: string;
  content: string;
  conversationId: number;
}

@UseGuards(WsAuthenticatedGuard)
@WebSocketGateway({
  namespace: '',
  cors: {
    origin: process.env.FRONTEND,
    credentials: true,
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppGateway.name);
  private readonly roomCounts = new Map<string, number>();

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
    private readonly gameService: GameService,
  ) {}

  afterInit() {
    this.logger.debug('AppGateway initialized');
  }

  async handleConnection(client: Socket): Promise<string> {
    const { user } = client.request;

    if (!user) {
      client.emit('unauthorized');
      this.logger.error('Unauthorized');
      return 'unauthorized';
    }

    // Join the user's room to keep track of all the user's sockets
    client.join(user.username);

    // Keep track of the number of sockets connected to the user's room
    const roomCount = this.roomCounts.get(user.username) || 0;
    this.roomCounts.set(user.username, roomCount + 1);

    this.server.to(client.id).emit('status', { status: Status.ONLINE });
    await this.chatService.toggleUserStatus(user.id, Status.ONLINE);

    const rooms: string[] = await this.chatService.getRoomsByUserId(user.id);
    rooms.forEach((room) => client.join(room));

    this.logger.debug(`Client ${user.username} connected`);

    return `connected`;
  }

  async handleDisconnect(client: Socket): Promise<string> {
    const user = client.request.user;

    if (!user) {
      client.emit('unauthorized');
      this.logger.error('Unauthorized');
      return 'unauthorized';
    }

    // Check if room user.username is empty
    // If it is, then the user has no more sockets connected
    // and we can set the user's status to offline
    const roomCount = this.roomCounts.get(user.username) || 0;
    this.roomCounts.set(user.username, roomCount - 1);
    if (roomCount - 1 === 0) {
      this.server.to(user.username).emit('status', { status: Status.OFFLINE });
      await this.chatService.toggleUserStatus(user.id, Status.OFFLINE);
    }

    this.logger.debug(`Client ${user.username} disconnected`);

    return `disconnected`;
  }

  @SubscribeMessage('message')
  async conMessage(
    @MessageBody() body: MessagePayload, // TODO: Change to DTO and validate it (make it same as prisma model)
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const { user } = client.request;
    const { room, conversationId, content } = body;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    const message = await this.messageService.create({
      content,
      conversationId,
      senderId: user.id,
    });

    this.server.to(room).emit('onMessage', message);

    return 'Message sent';
  }

  @SubscribeMessage('join')
  async onJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const user = client.request.user;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    this.server.to(user.username).socketsJoin(room);

    this.logger.debug(`Client ${user.username} joined room ${room}`);

    return room;
  }

  @SubscribeMessage('leave')
  async onLeave(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const user = client.request.user;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    this.server.to(user.username).socketsLeave(room);
    this.server.to(room).emit('onLeave', user.username);

    this.logger.debug(`Client ${user.username} left room ${room}`);

    return room;
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(
    @MessageBody() payload: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<number> {
    const user = client.request.user;

    const { type, participants } = payload;

    if (type == ConversationType.DM && participants.length === 1) {
      console.log('DM must have only two participants');
      participants.push(user.id);
      const sortedIds = participants.sort();
      payload.name = `Room${sortedIds[0]}-${sortedIds[1]}`;
    } else {
      payload.ownerId = user.id;

      if (!payload.image || payload.image === '') {
        const avatar = `uploads/chat-default-images/chat-image-${Math.floor(
          Math.random() * 6 + 1,
        )}.jpg`;

        payload.image = avatar;
      }
    }

    console.log({ payload });

    const chat = await this.chatService.create(payload);

    const participantsUsernames =
      await this.usersService.getUsernamesFromIds(participants);

    participantsUsernames.forEach((username) => {
      this.server.to(username).socketsJoin(chat.name);
      this.server.to(username).emit('onNotification', chat);
    });

    this.server.to(user.username).socketsJoin(chat.name);

    return chat.id;
  }

  @SubscribeMessage('joinQueue')
  joinGameQueue(client: Socket): void {
    const user = client.request.user;

    this.gameService.addUser({ id: client.id, socket: client, user })
    this.gameService.readyForGame();
  }

}
