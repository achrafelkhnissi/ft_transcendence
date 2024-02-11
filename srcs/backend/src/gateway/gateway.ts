import { GameService } from 'src/game/game.service';
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
import { WsAuthenticatedGuard } from 'src/common/guards/ws.guard';
import { CreateChatDto } from 'src/users/chat/dto/create-chat.dto';
import { GatewayService } from './gateway.service';

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
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(Gateway.name);
  private readonly roomCounts = new Map<string, number>();

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
    private readonly gameService: GameService,
  ) {} // private readonly gameService: GameService

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

    const userRoomName = `user-${user.id}`;

    // Join the user's room to keep track of all the user's sockets
    client.join(userRoomName);

    // Keep track of the number of sockets connected to the user's room
    const roomCount = this.roomCounts.get(userRoomName) || 0;
    this.roomCounts.set(userRoomName, roomCount + 1);

    this.server.to(client.id).emit('status', { status: Status.ONLINE });
    await this.gatewayService.toggleUserStatus(user.id, Status.ONLINE);
    const rooms: string[] = await this.gatewayService.getRoomsByUserId(user.id);

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

    const userRoomName = `user-${user.id}`;

    // Check if room user.username is empty
    // If it is, then the user has no more sockets connected
    // and we can set the user's status to offline
    const roomCount = this.roomCounts.get(userRoomName) || 0;
    this.roomCounts.set(userRoomName, roomCount - 1);
    if (roomCount - 1 === 0) {
      this.server.to(userRoomName).emit('status', { status: Status.OFFLINE });
      await this.gatewayService.toggleUserStatus(user.id, Status.OFFLINE);
    }

    this.logger.debug(`Client ${user.username} disconnected`);

    return `disconnected`;
  }

  @SubscribeMessage('joinQueue')
  joinGameQueue(client: Socket): void {
    const user = client.request.user;
    this.gameService.addUser({ id: client.id, socket: client, user });
    this.gameService.readyForGame();
  }
}
