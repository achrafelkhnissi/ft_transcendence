import { Logger, UseGuards } from '@nestjs/common';
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
import { WsAuthenticatedGuard } from './ws.guard';
import { Status } from '@prisma/client';

declare module 'http' {
  export interface IncomingMessage {
    session?: any; // Replace `any` with the actual type of `session` if known
  }
}

@UseGuards(WsAuthenticatedGuard)
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:1337', // Adjust according to your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('whoami')
  handleWhoAmI(client: Socket, payload: any) {
    return client.request.user;
  }

  @SubscribeMessage('join')
  joinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    this.logger.debug(`Client ${client.id} joined room ${room}`);
    this.server.emit('log', `Client ${client.id} joined room ${room}`);
    // TODO: add user to chatroom {room}
    const user = this.chatService.getUserFromSocket(client);
    this.chatService.addUserToChat(user, room);
  }

  joinRoomWithUser(user: any, room: string) {
    this.joinRoom(room, user.socket);
    this.server.emit('log', `Client ${user.username} joined room ${room}`);
    this.server.to(room).emit('message', {
      message: `${user.username} joined the chat`,
      id: 'server',
    });
  }

  @SubscribeMessage('leave')
  leaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.leave(room);
    this.logger.debug(`Client ${client.id} left room ${room}`);
    this.server.emit('log', `Client ${client.id} left room ${room}`);
    // TODO: remove user from chatroom {room}
    const user = this.chatService.getUserFromSocket(client);
    this.chatService.removeUserFromChat(user, room);
  }

  @SubscribeMessage('message')
  sendMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.logger.debug(`Client ${client.id} sent message to room ${data.room}`);
    this.server.to(data.room).emit('message', data);
    // TODO: save message to database

    // this.chatService.saveMessage(data);
  }

  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatService.create(createChatDto);
  // }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);

  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }

  @SubscribeMessage('message')
  onMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.logger.debug(`[message] [${client.id}]: ${body.message ?? body}`);
    this.server.emit('message', {
      message: body,
      id: client.id,
    });
    // TODO: save message to database
    // this.chatService.saveMessage(body);
  }

  //TEST: Sending a private message to a specific user
  @SubscribeMessage('privateMessage')
  onPrivateMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug(
      `[privateMessage] [${client.id}]: ${body.message ?? body}`,
    );
    // TODO: body.to can be changed to roomId or room!
    client.to(body.to).emit('.message', {
      from: client.id, // Either from user or userId
      to: body.to, // Either to user or userId
      message: body.message,
    });
  }

  @SubscribeMessage('log')
  onLog(@MessageBody() body: any) {
    this.logger.debug(`Log received: ${body}`);
    this.server.emit('log', body);
  }

  afterInit(server: any) {
    this.logger.debug('MyGateway initialized');
    this.server.on('connection', (socket) => {
      const serverId = 'server';
      socket.emit('message', {
        message: `Welcome to the server! Your id is ${socket.id}`,
        id: serverId,
      });

      // TODO: Testing sending a message to a specific user
      // this.server.to(socket.id).emit('message', {
      //   message: `Test`,
      //   id: serverId,
      // });
    });
  }

  async handleDisconnect(client: Socket) {
    const user = client.request.user;
    await this.chatService.toggleUserStatus(user.id, Status.OFFLINE);

    this.logger.debug(`[${user.username}] disconnected`);
    this.server.emit('log', `-> ${user.username} disconnected`);
  }

  @UseGuards(WsAuthenticatedGuard) // FIXME: This guard is not working
  async handleConnection(client: Socket, ...args: any[]) {
    const user = client.request.user;

    // TODO: Check if user is already connected and see what to do with the new connection

    const { sockets } = this.server.sockets;
    this.logger.debug(
      `[${sockets.size}] [WS] [${user.username}] connected with id ${client.id}`,
    );
    this.server.emit(
      'log',
      `-> ${user.username} connected with id ${client.id}`,
    );

    await this.chatService.toggleUserStatus(user.id, Status.ONLINE);
  }
}
