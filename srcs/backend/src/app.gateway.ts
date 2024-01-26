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
import { IsEnum } from 'class-validator';
import { CreateChatDto } from './users/chat/dto/create-chat.dto';

interface MessagePayload {
  room: string;
  to: string;
  content: string;
  conversationId: number;
}

class UserStatusDto {
  @IsEnum(Status)
  status: Status;
}

@UseGuards(WsAuthenticatedGuard)
@WebSocketGateway({
  namespace: '',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AppGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
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

    this.server.to(user.username).emit('status', { status: Status.OFFLINE });
    await this.chatService.toggleUserStatus(user.id, Status.OFFLINE);

    client.leave(user.username);
    client.disconnect();
    this.logger.debug(`Client ${user.username} disconnected`);

    return `disconnected`;
  }

  @SubscribeMessage('message')
  async conMessage(
    @MessageBody() body: MessagePayload, // TODO: Create a DTO for this
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const { user } = client.request;
    const { room, conversationId, content, to: receiverUsername } = body;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    const message = await this.messageService.create({
      content,
      conversationId,
      senderId: user.id,
      receiverUsername,
    });

    this.server.to(room).emit('onMessage', message);

    return receiverUsername;
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

    // client.leave(room);
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
    }

    console.log({ payload });

    const chat = await this.chatService.create(payload);

    const receiverId = participants.find((id) => id !== user.id);
    const receiver = await this.usersService.findById(receiverId);

    this.server.to(receiver.username).socketsJoin(chat.name);
    this.server.to(user.username).socketsJoin(chat.name);

    this.server.to(receiver.username).emit('onNotification', chat);

    return chat.id;
  }

  @SubscribeMessage('typing')
  async onTyping(
    @MessageBody() payload: any, // TODO: Create a DTO for this
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const { user } = client.request;

    this.server.to(payload.name).emit('onTyping', `${user.username} is typing`);

    return 'typing';
  }

  @SubscribeMessage('stopTyping')
  async onStopTyping(
    @MessageBody() payload: any, // TODO: Create a DTO for this
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const { user } = client.request;

    this.server
      .to(payload.name)
      .emit('onStopTyping', `${user.username} stopped typing`);

    return 'stopTyping';
  }

  @SubscribeMessage('read')
  async onRead(
    @MessageBody() payload: any, // TODO: Create a DTO for this
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const { user } = client.request;

    this.server.to(payload.name).emit('onRead', user.username);

    return 'read';
  }

  @SubscribeMessage('status')
  async onStatus(
    @MessageBody() payload: UserStatusDto,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const { user } = client.request;

    // Only update the status if the room `user.username` is empty
    this.server.to(user.username).emit('status', payload);

    return 'status';
  }
}
