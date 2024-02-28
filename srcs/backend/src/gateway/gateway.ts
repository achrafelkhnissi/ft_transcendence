import { GameService } from 'src/game/game.service';
import {
  Inject,
  Logger,
  UnauthorizedException,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
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
  readonly roomCounts = new Map<string, number>();

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
  ) {}

  afterInit() {
    this.logger.log('AppGateway initialized');
  }

  async handleConnection(client: Socket): Promise<string> {
    const { user } = client.request;

    if (!user) {
      return 'unauthorized';
    }

    const userRoomName = `user-${user.id}`;

    // Join the user's room to keep track of all the user's sockets
    client.join(userRoomName);

    // Keep track of the number of sockets connected to the user's room
    const roomCount = this.roomCounts.get(userRoomName) || 0;
    this.roomCounts.set(userRoomName, roomCount + 1);

    if (roomCount === 0) {
      this.logger.log(`Client ${user.username} connected`);
      await this.gatewayService.toggleUserStatus(user.id, Status.ONLINE);
    }

    const rooms: string[] = await this.gatewayService.getRoomsByUserId(user.id);
    rooms.forEach(async (room) => {
      client.join(room);
      if (roomCount === 0) {
        this.server.to(room).emit('status', {
          userId: user.id,
          status: Status.ONLINE,
        });
      }
    });

    return `connected`;
  }

  async handleDisconnect(client: Socket): Promise<string> {
    const user = client.request.user;

    if (!user) {
      return 'unauthorized';
    }
    //remove from the game
    this.gameService.removeUserById(user.id);

    const userRoomName = `user-${user.id}`;
    // Check if room user.username is empty
    // If it is, then the user has no more sockets connected
    // and we can set the user's status to offline
    const roomCount = this.roomCounts.get(userRoomName) || 0;
    this.roomCounts.set(userRoomName, roomCount - 1);
    if (roomCount - 1 <= 0) {
      this.logger.log(`Client ${user.username} disconnected`);
      await this.gatewayService.toggleUserStatus(user.id, Status.OFFLINE);
    }

    const rooms: string[] = await this.gatewayService.getRoomsByUserId(user.id);
    rooms.forEach(async (room) => {
      client.leave(room);
      if (roomCount - 1 <= 0) {
        this.server.to(room).emit('status', {
          userId: user.id,
          status: Status.OFFLINE,
        });
      }
    });

    client.leave(userRoomName);

    return `disconnected`;
  }

  @SubscribeMessage('joinQueue')
  joinGameQueue(client: Socket): void {
    const user = client.request.user;
    this.gameService.addUser({ socket: client, id: user.id });
    this.gameService.readyForGame();
  }

  @SubscribeMessage('game-invite')
  InviteToGame(client: Socket, payload: { inviterId: number }): void {
    const user = client.request.user;
    if (!this.gameService.PlayerisAvailable(payload.inviterId)) {
      client.emit('invited not available');
      return;
    }
    const gameRoom = this.gameService.createGameRoomName(
      payload.inviterId,
      user.id,
    );
    this.gameService.activeRoom[gameRoom] = [];
    this.server.to(`user-${payload.inviterId}`).emit('game-invite', {
      room: gameRoom,
      userId: user.id,
      username: user.username,
    });
  }

  @SubscribeMessage('inviteResponse')
  InviteResponce(
    client: Socket,
    payload: { response: boolean; gameRoom: string; inviter: number },
  ) {
    const user = client.request.user;
    this.server.to(`user-${payload.inviter}`).emit('inviteResponse', {
      response: payload.response,
      room: payload.gameRoom,
    });
    if (payload.response === false) {
      delete this.gameService.activeRoom[payload.gameRoom];
    }
  }

  @SubscribeMessage('joinRoom')
  joinGameRoom(client: Socket, gameRoom: string) {
    const user = client.request.user;
    if (!this.gameService.activeRoom[gameRoom]) {
      client.emit('room not found');
      return;
    }
    const player = { socket: client, id: user.id };
    this.gameService.handelInviteRooms(player, gameRoom);
  }
}
