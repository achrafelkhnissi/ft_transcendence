import { PrismaService } from './../prisma/prisma.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Match } from './match';
import { CreateGameDto } from './dto/create-game.dto';
import { UserType } from 'src/common/interfaces/user.interface';
import { NotificationsService } from 'src/users/notifications/notifications.service';
import { Gateway } from 'src/gateway/gateway';

interface Player {
  socket: Socket;
  id: number;
}

@Injectable()
export class GameService {
  private activeMatches: { [key: string]: Match } = {};
  public activeRoom: { [key: string]: Player[] } = {};
  private playerQueue: Player[] = [];
  private onlineGamers: Player[] = [];

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {
    this.updateGame();
  }

  updateGame() {
    setInterval(async () => {
      const matchesToRemove = [];
      for (const key in this.activeMatches) {
        const match = this.activeMatches[key];
        if (match.isFinished) {
          console.log('save match');
          const id1: number = parseInt(key.split('-')[0]);
          const id2: number = parseInt(key.split('-')[1]);
          await this.saveMatch({
            winnerId: match.score.player1 > match.score.player2 ? id1 : id2,
            loserId: match.score.player1 < match.score.player2 ? id1 : id2,
            score: `${match.score.player1} - ${match.score.player2}`,
          });
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
    const match = new Match(player1.socket, player2.socket);
    this.activeMatches[matchKey] = match;
    setTimeout(() => match.gameStart(), 5000);
    this.onlineGamers.push(player1);
    this.onlineGamers.push(player2);
  }

  readyForGame() {
    setTimeout(() => {
      if (this.getAllUsers().length == 1)
        this.removeUser().socket.emit('nta wahid');
    }, 10000);
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
    const winnerExp: number = await this.prismaService.userStats
      .findUnique({
        where: {
          userId: data.winnerId,
        },
        select: {
          exp: true,
        },
      })
      .then((res) => res.exp);

    let newExp = winnerExp + 30;
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

  PlayerisAvailable(playerId: number){
    if (
      !this.playerQueue.find((player) => player.id === playerId) &&
      !this.onlineGamers.find((player) => player.id === playerId)
    ) 
      return true;
    return false
  }
}