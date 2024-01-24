import { UserType } from 'src/common/interfaces/user.interface';
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
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Status } from '@prisma/client';
import { ChatService } from 'src/users/chat/chat.service';
import { MessageService } from 'src/users/chat/message/message.service';
import { WsAuthenticatedGuard } from './common/guards/ws.guard';
import { IsEnum } from 'class-validator';

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
  ) {}

  afterInit() {
    this.logger.debug('AppGateway initialized');
  }

  async handleConnection(client: Socket): Promise<WsResponse<string>> {
    const { user } = client.request;

    if (!user) {
      client.disconnect();
      this.logger.error('Unauthorized');
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

    return { event: 'connected', data: 'Connection established' };
  }

  async handleDisconnect(client: Socket): Promise<WsResponse<string>> {
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

    return { event: 'disconnected', data: 'Connection terminated' };
  }

  @SubscribeMessage('message')
  async conMessage(
    @MessageBody() body: MessagePayload, // TODO: Create a DTO for this
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<string>> {
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

    return { event: 'message', data: 'Message sent' };
  }

  @SubscribeMessage('join')
  async onJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<string>> {
    const user = client.request.user;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    this.server.to(user.username).socketsJoin(room);

    this.logger.debug(`Client ${user.username} joined room ${room}`);

    return { event: 'joined', data: `Joined room ${room}` };
  }

  @SubscribeMessage('leave')
  async onLeave(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<string>> {
    const user = client.request.user;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    // client.leave(room);
    this.server.to(user.username).socketsLeave(room);
    this.server.to(room).emit('onLeave', user.username);

    this.logger.debug(`Client ${user.username} left room ${room}`);

    return { event: 'left', data: `Left room ${room}` };
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(
    @MessageBody() payload: any, // TODO: Create a DTO for this
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<string>> {
    const { to: receiver, roomName } = payload;
    const { user } = client.request;

    console.log({
      user,
      receiver,
    });

    this.server.to(receiver).socketsJoin(roomName);
    this.server.to(user.username).socketsJoin(roomName);

    client.emit('joinedRoom', roomName, (ack: string) => {
      console.log({
        joinedRoomAck: ack,
      });
    });

    return { event: 'createRoom', data: `Created room ${roomName}` };
  }

  // @SubscribeMessage('typing')
  // async onTyping(
  //   @MessageBody() payload: any, // TODO: Create a DTO for this
  //   @ConnectedSocket() client: Socket,
  // ): Promise<WsResponse<string>> {
  //   // const { to: toUsername, roomName } = payload;
  //   // const { user } = client.request;

  //   // this.server.to(roomName).emit('onTyping', toUsername);

  //   return { event: 'typing', data: 'Started typing a message' };
  // }

  // @SubscribeMessage('stopTyping')
  // async onStopTyping(
  //   @MessageBody() payload: any, // TODO: Create a DTO for this
  //   @ConnectedSocket() client: Socket,
  // ): Promise<WsResponse<string>> {
  //   // const { to: toUsername, roomName } = payload;
  //   // const { user } = client.request;

  //   // this.server.to(roomName).emit('onStopTyping', toUsername);

  //   return { event: 'stopTyping', data: 'Stopped typing a message' };
  // }

  // @SubscribeMessage('read')
  // async onRead(
  //   @MessageBody() payload: any, // TODO: Create a DTO for this
  //   @ConnectedSocket() client: Socket,
  // ): Promise<WsResponse<string>> {
  //   // const { to: toUsername, roomName } = payload;
  //   // const { user } = client.request;

  //   // this.server.to(roomName).emit('onRead', toUsername);

  //   return { event: 'read', data: 'Read a message' };
  // }

  // @SubscribeMessage('status')
  // async onStatus(
  //   @MessageBody() payload: UserStatusDto,
  //   @ConnectedSocket() client: Socket,
  // ): Promise<WsResponse<string>> {
  //   // const { to: toUsername, roomName } = payload;
  //   // const { user } = client.request;

  //   // this.server.to(roomName).emit('onStatus', toUsername);

  //   return { event: 'status', data: `Status changed to ${payload.status}` };
  // }

  // @SubscribeMessage('notification')
  // async onNotification(
  //   @MessageBody() payload: any, // TODO: Use notification DTO for this
  //   @ConnectedSocket() client: Socket,
  // ): Promise<WsResponse<string>> {
  //   return { event: 'notification', data: 'Notification received' };
  // }
}
