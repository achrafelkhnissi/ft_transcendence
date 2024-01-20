import { Logger, UnauthorizedException } from '@nestjs/common';
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
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Status } from '@prisma/client';
import { MessageService } from 'src/message/message.service';

interface MessagePayload {
  room: string;
  to: string;
  content: string;
  conversationId: number;
}

// @UseGuards(WsAuthenticatedGuard) // FIXME: This guard is not working (Causes the client to disconnect)
@WebSocketGateway({
  // namespace: 'chat',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @SubscribeMessage('message')
  async conMessage(
    @MessageBody() body: MessagePayload, // TODO: Create a DTO for this
    @ConnectedSocket() client: Socket,
  ) {
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

    return 'OK';
  }

  afterInit(server: Server) {
    this.logger.debug('MyGateway initialized');
  }

  async handleConnection(client: Socket) {
    const { user } = client.request;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    // Join the user's room to keep track of all the user's sockets
    client.join(user.username);

    this.server.to(client.id).emit('status', { status: Status.ONLINE });
    await this.chatService.toggleUserStatus(user.id, Status.ONLINE);

    const rooms: string[] = await this.chatService.getRoomsByUserId(user.id);
    rooms.forEach((room) => client.join(room));

    //q: How to get all the room that exists in the server?
    // const rooms = this.server.sockets.adapter.rooms;

    this.logger.debug(`Client ${user.username} connected`);
  }

  async handleDisconnect(client: Socket) {
    const user = client.request.user;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    this.server.to(user.username).emit('status', { status: Status.OFFLINE });
    await this.chatService.toggleUserStatus(user.id, Status.OFFLINE);

    client.leave(user.username);
    client.disconnect();
    this.logger.debug(`Client ${user.username} disconnected`);
    return 'CONNECTED';
  }

  @SubscribeMessage('join')
  async onJoin(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    const user = client.request.user;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    this.server.to(user.username).socketsJoin(room);
    // client.join(room);

    this.logger.debug(`Client ${user.username} joined room ${room}`);
    return 'JOINED';
  }

  @SubscribeMessage('leave')
  async onLeave(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.request.user;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    // client.leave(room);
    this.server.to(user.username).socketsLeave(room);
    this.server.to(room).emit('onLeave', user.username);

    this.logger.debug(`Client ${user.username} left room ${room}`);
    return 'LEFT';
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(
    @MessageBody() payload: any, // TODO: Create a DTO for this
    @ConnectedSocket() client: Socket,
  ) {
    const { to: toUsername, roomName } = payload;

    this.server.to(toUsername).socketsJoin(roomName);
    client.join(roomName);
    // this.server.to(client.request.user.username).socketsJoin(roomName);

    return 'CREATED';
  }
}
