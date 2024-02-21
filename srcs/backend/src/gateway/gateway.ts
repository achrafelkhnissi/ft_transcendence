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
  private readonly roomCounts = new Map<string, number>();

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gatewayService: GatewayService,
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

    const userRoomName = `user-${user.id}`;

    console.log(`${user.username} connected`);

    // Join the user's room to keep track of all the user's sockets
    client.join(userRoomName);

    // Keep track of the number of sockets connected to the user's room
    const roomCount = this.roomCounts.get(userRoomName) || 0;
    this.roomCounts.set(userRoomName, roomCount + 1);
    if (roomCount === 0) {
      this.logger.debug(`Client ${user.username} connected`);
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
      client.emit('unauthorized');
      this.logger.error('Unauthorized');
      return 'unauthorized';
    }

    const userRoomName = `user-${user.id}`;

    console.log(`${user.username} disconnected`);


    // Check if room user.username is empty
    // If it is, then the user has no more sockets connected
    // and we can set the user's status to offline
    const roomCount = this.roomCounts.get(userRoomName) || 0;
    this.roomCounts.set(userRoomName, roomCount - 1);
    if (roomCount - 1 <= 0) {
      this.logger.debug(`Client ${user.username} disconnected`);
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

    return `disconnected`;
  }

  @SubscribeMessage('joinQueue')
  joinGameQueue(client: Socket): void {
    const user = client.request.user;
    console.log(`User ${user.username} joined the queue!`);
    this.gameService.addUser({socket: client, user});
    this.gameService.readyForGame();
  }
  
  @SubscribeMessage('game-invite')
  InviteToGame(client: Socket, payload: { inviterId: number }): void {
    const user = client.request.user;
    const gameRoom = this.gameService.createGameRoomName(payload.inviterId, user.id);  
    this.server.to(`user-${payload.inviterId}`).emit('game-invite', {room: gameRoom, userId:user.id, username: user.username});
    console.log(gameRoom)
    // this.gameService.inviteGame()
  }

  @SubscribeMessage('inviteResponse')
  InviteResponce(client: Socket, payload: {response: boolean, gameRoom : string, inviter : number}){
    const user = client.request.user;
    console.log('sent response to ', payload.inviter)
    this.server.to(`user-${payload.inviter}`).emit('inviteResponse', {response: payload.response, room: payload.gameRoom});
    // if (payload.response){
    //   const sockets = this.server.sockets.adapter.rooms.get(
    //     payload.gameRoom
    //   );
    //   sockets.forEach((socketId) => {
    //     this.gateway.server.sockets.sockets
    //       .get(socketId)
    //       .join(blockedUsersRoomName);
    //   });
    // }

  }

  @SubscribeMessage('joinRoom')
  JoingameRoom(client: Socket, gameRoom : string){
    const user = client.request.user;
    client.join(gameRoom);
      const sockets = this.server.sockets.adapter.rooms.get(
        gameRoom
      );
      sockets?.forEach((socketId) => {
        this.server.sockets.sockets
          .get(socketId)
      });
  }

}
