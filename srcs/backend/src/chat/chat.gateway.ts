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

  private connectedUsers = new Map<string, string[]>();

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

    // TODO: Save message to database
    const message = await this.messageService.create({
      content,
      conversationId,
      senderId: user.id,
      receiverUsername,
    });

    this.server.to(room).emit('message', {
      from: user.username,
      message,
    });

    this.logger.debug(`[message] [${user.username}] ${content}`);

    return 'OK';
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
    const user = client.request.user;
    const { username } = user;

    this.logger.debug(`Client ${client.id} disconnected`);
    this.server.to(client.id).emit('status', { status: Status.OFFLINE });

    const rooms: string[] = await this.chatService.getRoomsByUserId(user.id);
    rooms.forEach((room) => {
      client.leave(room);
      this.server.to(room).emit('message', {
        message: `${username} left the chat`,
        id: 'server',
      });
    });
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
    const { user } = client.request;

    if (!user) {
      client.disconnect();
      throw new UnauthorizedException('Unauthorized');
    }

    // TODO: Check which better? storing the socketIds or the sockets themselves
    if (!this.connectedUsers.has(user.username)) {
      this.connectedUsers.set(user.username, []);
    }

    // push the socket id to the connectedUsers Map
    this.connectedUsers.get(user.username).push(client.id);

    const { sockets } = this.server.sockets;

    const { username } = user ?? { username: `unknown${sockets.size}` };

    this.logger.debug(
      `[${sockets.size}] [WS] [${username}] connected with id ${client.id}`,
    );

    await this.chatService.toggleUserStatus(user.id, Status.ONLINE);
    this.server.to(client.id).emit('status', { status: Status.ONLINE });

    client.emit('onConnect', { msg: `[${client.id}] You are connected` });

    const rooms: string[] = await this.chatService.getRoomsByUserId(user.id);
    rooms.forEach((room) => {
      client.join(room);
      this.server.to(room).emit('message', {
        message: `${username} joined the chat`,
        id: 'server',
      });
    });
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

  @SubscribeMessage('leave')
  async onLeave(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.request.user;

    // if (!user) {
    //   client.disconnect();
    //   throw new UnauthorizedException('Unauthorized');
    // }

    const { username } = user ?? { username: `unknown${client.id}` };

    this.logger.debug(`[WS] [${username}] left room ${room}`);

    client.leave(room);
    this.server.to(room).emit('onMessage', {
      message: `${username} left the chat`,
      id: 'server',
    });
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(
    @MessageBody() payload: any, // TODO: Create a DTO for this
    @ConnectedSocket() client: Socket,
  ) {
    const { to: toUsername, roomName } = payload;

    const receiverSocketIds = this.connectedUsers.get(toUsername) ?? [];

    receiverSocketIds.forEach((socketId) => {
      this.server.sockets.sockets.get(socketId).join(roomName);
      // this.server.to(roomName).socketsJoin(roomName);
    });
    client.join(roomName);

    return 'OK';
  }
}
