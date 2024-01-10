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
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { WsAuthenticatedGuard } from './ws.guard';
import { Status } from '@prisma/client';
import { Hash } from 'crypto';

// @UseGuards(WsAuthenticatedGuard) // FIXME: This guard is not working (Causes the client to disconnect)
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:*'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  connectedUsers = new Map<string, string[]>();

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }

  @SubscribeMessage('message')
  onMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.logger.debug(`[message] [${client.id}]: ${body.message ?? body}`);

    const { username } = client.request.user ?? {
      username: `unknown${client.id}`,
    };

    if (!body.room) {
      this.server.emit('onMessage', {
        from: username, // or user or userId
        body,
      });
      return;
    }

    this.server.to(body.room).emit('message', {
      from: username, // or user or userId
      body,
    });

    // TODO: Save message to database
  }

  afterInit(server: Server) {
    this.logger.debug('MyGateway initialized');
    this.server.on('connection', (socket) => {
      socket.emit('server', {
        message: `Welcome to the server! Your id is ${socket.id}`,
        id: 'server',
      });
    });
  }

  async handleDisconnect(client: Socket) {
    // const user = client.request.user;
    // await this.chatService.toggleUserStatus(user.id, Status.OFFLINE);

    this.logger.debug(`Client ${client.id} disconnected`);
    this.server.to(client.id).emit('status', { status: Status.OFFLINE });

    // const rooms: string[] = await this.chatService.getRoomsByUserId(user.id);
    // rooms.forEach((room) => {
    //   client.leave(room);
    //   this.server.to(room).emit('message', {
    //     message: `${username} left the chat`,
    //     id: 'server',
    //   });
    // });
  }

  /**
   * When a client connects to the server
   * @param client The socket that connected
   * @todo
   * - Add the user to the connected users Map and keep track of the socket ids
   * - Add the user to the rooms he is in
   * - Send a message to the rooms he is in that he joined
   * - Send a message to the client that he is connected
   */
  // @UseGuards(WsAuthenticatedGuard) // FIXME: This guard is not working
  async handleConnection(client: Socket) {
    const user = client.request.user;

    // console.log({
    //   request: client.request,
    // });

    // if (!user) {
    //   client.disconnect();
    //   throw new UnauthorizedException('Unauthorized');
    // }

    // todo: Refactor this
    if (user) {
      // To keep track of the connected users
      const socketIds = this.connectedUsers.get(user.id) ?? [];
      socketIds.push(client.id);
      this.connectedUsers.set(user.id, socketIds);
    }

    const { sockets } = this.server.sockets;

    const { username } = user ?? { username: `unknown${sockets.size}` };

    this.logger.debug(
      `[${sockets.size}] [WS] [${username}] connected with id ${client.id}`,
    );

    // await this.chatService.toggleUserStatus(user.id, Status.ONLINE);
    // client.emit('status', { status: Status.ONLINE });
    this.server.to(client.id).emit('status', { status: Status.ONLINE });
    client.emit('onConnect', { msg: `[${client.id}] You are connected` });

    // const rooms: string[] = await this.chatService.getRoomsByUserId(user.id);
    // rooms.forEach((room) => {
    //   client.join(room);
    //   this.server.to(room).emit('message', {
    //     message: `${username} joined the chat`,
    //     id: 'server',
    //   });
    // });
  }

  @SubscribeMessage('join')
  async onJoin(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    const user = client.request.user;

    // if (!user) {
    //   client.disconnect();
    //   throw new UnauthorizedException('Unauthorized');
    // }

    const { username } = user ?? { username: `unknown${client.id}` };

    this.logger.debug(`[WS] [${username}] joined room ${room}`);

    client.join(room);
    this.server.to(room).emit('onMessage', {
      message: `${username} joined the chat`,
      id: 'server',
    });
  }
}
