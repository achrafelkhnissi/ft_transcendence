import { AchievementsService } from './../users/achievements/achievements.service';
import { PrismaService } from './../prisma/prisma.service';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  forwardRef,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { Match } from './match';
import { CreateGameDto } from './dto/create-game.dto';
import { Gateway } from 'src/gateway/gateway';
import { Status } from 'src/common/enums/status.enum';

interface Player {
  socket: Socket;
  id: number;
}

@Injectable()
export class GameService implements OnModuleDestroy {
  private activeMatches: { [key: string]: Match } = {};
  public activeRoom: { [key: string]: Player[] } = {};
  private playerQueue: Player[] = [];
  private onlineGamers: Player[] = [];
  updateGameInterval: NodeJS.Timeout;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly achievementsService: AchievementsService,
    @Inject(forwardRef(() => Gateway))
    private readonly gateway: Gateway,
  ) {
    this.updateGame();
  }
  onModuleDestroy() {
    console.log('clearing interval');
    clearInterval(this.updateGameInterval);
  }

  updateGame() {
    this.updateGameInterval = setInterval(async () => {
      const matchesToRemove = [];
      for (const key in this.activeMatches) {
        const match = this.activeMatches[key];
        if (match.isFinished) {
          console.log('delete match');
          match.isFinished = false;
          matchesToRemove.push(key);
        }
      }
      matchesToRemove.forEach((key) => {
        delete this.activeMatches[key];
      });
    }, 100);
  }

  addUser(user: Player): void {
    const userId = user.id;

    if (this.PlayerisAvailable(userId)) {
      this.playerQueue.push(user);
      console.log('Player added to the queue');
    } else {
      console.log('Player is already in the queue');
      user.socket.emit('already in the game');
    }
  }

  removeUser(): Player | undefined {
    return this.playerQueue.shift();
  }

  getAllUsers(): Player[] {
    return this.playerQueue;
  }

  createMatch(player1: Player, player2: Player): void {
    console.log('match creat');
    const matchKey = `${player1.id}-${player2.id}`;
    console.log(matchKey);
    const match = new Match(player1, player2, this);
    this.activeMatches[matchKey] = match;
    setTimeout(async () => {
      match.gameStart();
    }, 5000);
    this.onlineGamers.push(player1);
    this.onlineGamers.push(player2);
  }

  readyForGame() {
    setTimeout(() => {
      if (this.getAllUsers().length == 1)
        this.removeUser().socket.emit('nta wahid');
    }, 30000);
    let size = this.playerQueue.length;
    console.log(size);
    if (size >= 2) {
      console.log('readyForGame');
      const client1 = this.removeUser();
      const client2 = this.removeUser();
      client1.socket.emit('start game', {
        playerPosition: 'leftPaddle',
        opponentId: client2.id,
      });
      client2.socket.emit('start game', {
        playerPosition: 'rightPaddle',
        opponentId: client1.id,
      });
      console.log('event sent');
      this.createMatch(client1, client2);
    }
  }

  removeUserById(userId: number): void {
    console.log('player removed by id from the queue');
    this.playerQueue = this.playerQueue.filter(
      (player) => player.id !== userId,
    );
    this.onlineGamers = this.playerQueue.filter(
      (player) => player.id !== userId,
    );
    this.removePlayer(userId);
  }

  handelInviteRooms(user: Player, gameRoom: string) {
    this.activeRoom[gameRoom].push(user);
    setTimeout(() => {
      if (this.activeRoom[gameRoom] && this.activeRoom[gameRoom].length < 2) {
        user.socket.emit('invitation expired');
        console.log('invitation expired');
        delete this.activeRoom[gameRoom];
      }
    }, 30000);
    if (this.activeRoom[gameRoom].length === 2) {
      const [player1, player2] = this.activeRoom[gameRoom];
      this.activeRoom[gameRoom] = this.activeRoom[gameRoom].filter(
        (player) => player !== player1 && player !== player2,
      );
      delete this.activeRoom[gameRoom];
      this.inviteGame(player1, player2);
    }
  }

  inviteGame(inviter: Player, invited: Player) {
    console.log('gameroom start');
    console.log('gameroom start');
    inviter.socket.emit('start game', {
      playerPosition: 'leftPaddle',
      opponentId: invited.id,
    });
    invited.socket.emit('start game', {
      playerPosition: 'rightPaddle',
      opponentId: inviter.id,
    });
    this.createMatch(inviter, invited);
  }

  async saveMatch(data: CreateGameDto) {
    const winnerStats = await this.prismaService.userStats.findUnique({
      where: {
        userId: data.winnerId,
      },
      select: {
        exp: true,
        wins: true,
        level: true,
        losses: true,
      },
    });

    console.log(`winner is ${data.winnerId}`);
    console.log(`stats are ${winnerStats}`);

    let newExp = winnerStats.exp + 30;
    let levelIncrement = 0;

    if (newExp >= 100) {
      levelIncrement = 1;
      newExp = newExp - 100;
    }

    await this.prismaService.userStats.update({
      where: {
        userId: data.winnerId,
      },
      data: {
        wins: {
          increment: 1,
        },
        exp: newExp,
        ...(levelIncrement && { level: { increment: levelIncrement } }),
      },
    });

    await this.prismaService.userStats.update({
      where: {
        userId: data.loserId,
      },
      data: {
        losses: {
          increment: 1,
        },
      },
    });

    await this.achievementsService.giveAchievementsToUserAfterGame(
      data.winnerId,
    );

    await this.achievementsService.giveAchievementsToUserAfterGame(
      data.loserId,
    );

    return this.prismaService.game.create({
      data,
    });
  }

  getGameHistory(userId: number) {
    return this.prismaService.game.findMany({
      where: {
        OR: [
          {
            winnerId: userId,
          },
          {
            loserId: userId,
          },
        ],
      },
      select: {
        winner: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        loser: {
          select: {
            id: true,
            avatar: true,
            username: true,
          },
        },
        score: true,
      },
    });
  }

  createGameRoomName(playerId1: number, playerId2: number) {
    const sortedIds = [playerId1, playerId2].sort();
    return `room-${sortedIds[0]}-${sortedIds[1]}`;
  }

  PlayerisAvailable(playerId: number) {
    if (
      !this.playerQueue.find((player) => player.id === playerId) &&
      !this.onlineGamers.find((player) => player.id === playerId)
    )
      return true;
    return false;
  }

  removePlayer(playerToRemove: number): void {
    for (const roomKey in this.activeRoom) {
      const playersInRoom = this.activeRoom[roomKey];
      const index = playersInRoom.findIndex(
        (player) => player.id === playerToRemove,
      );

      if (index !== -1) {
        playersInRoom.splice(index, 1);
      }
    }
  }

  private async getRoomsByUserId(userId: number): Promise<string[]> {
    return this.prismaService.conversation
      .findMany({
        where: {
          OR: [
            {
              participants: {
                some: {
                  id: userId,
                },
              },
            },
            {
              admins: {
                some: {
                  id: userId,
                },
              },
            },
            {
              ownerId: userId,
            },
          ],
        },
      })
      .then((rooms) => rooms.map((room) => room.name));
  }

  async toggleUserStatus(userId: number, status: Status): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { status: status },
    });

    const rooms: string[] = await this.getRoomsByUserId(userId);
    rooms.forEach(async (room) => {
      this.gateway.server.to(room).emit('status', {
        userId: userId,
        status: status,
      });
    });
  }
}
