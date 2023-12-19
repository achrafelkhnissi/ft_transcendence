import { Logger } from '@nestjs/common';
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
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join')
  joinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    this.logger.debug(`Client ${client.id} joined room ${room}`);
    this.server.emit('log', `Client ${client.id} joined room ${room}`);
    // TODO: add user to chatroom {room}
    // const user = this.chatService.getUserFromSocket(client);
    // this.chatService.addUserToChat(user, room);
  }

  @SubscribeMessage('leave')
  leaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.leave(room);
    this.logger.debug(`Client ${client.id} left room ${room}`);
    this.server.emit('log', `Client ${client.id} left room ${room}`);
    // TODO: remove user from chatroom {room}
    // const user = this.chatService.getUserFromSocket(client);
    // this.chatService.removeUserFromChat(user, room);
  }

  @SubscribeMessage('message')
  sendMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.logger.debug(`Client ${client.id} sent message to room ${data.room}`);
    this.server.to(data.room).emit('message', data);
    // TODO: save message to database
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

  handleDisconnect(client: Socket) {
    // const user = client.data.user;
    // const user = this.chatService.getUserFromSocket(client);
    // this.chatService.removeUserFromChat(user, client);
    this.logger.debug(`Client disconnected: ${client.id}`);
    this.server.emit('log', `Client disconnected: ${client.id}`);
    // TODO: Set user as offline
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { sockets } = this.server.sockets;
    this.logger.debug(`[${sockets.size}] Client conneced: ${client.id}`);
    this.server.emit('log', `Client connected: ${client.id}`);
    // TODO: Set user as online

    // TODO: Get all connected clients
    // const connectedClients = Array.from(sockets).map(([_, socket]) => ({
    //   userId: socket.id,
    // }));

    // console.log({
    //   connectedClients,
    // });
  }
}
