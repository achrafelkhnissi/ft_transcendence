import { PrismaService } from './../prisma/prisma.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Match } from './match';
import { CreateGameDto } from './dto/create-game.dto';
import { UserType } from 'src/common/interfaces/user.interface';
import { NotificationsService } from 'src/users/notifications/notifications.service';

interface Player {
  id: string;
  socket: Socket;
  user: UserType;
}

@Injectable()
export class GameService {
  private activeMatches: { [key: string]: Match } = {};
  private playerQueue: Player[] = [];

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {
    this.updateGame();
  }

  updateGame() {
    setInterval(async () => {
      for (const key in this.activeMatches) {
        const match = this.activeMatches[key];
        if (match.isFinished) {
          const id1: number = parseInt(key.split('-')[0]);
          const id2: number = parseInt(key.split('-')[1]);
          await this.saveMatch({
            winnerId: match.score.player1 > match.score.player2 ? id1 : id2,
            loserId: match.score.player1 < match.score.player2 ? id1 : id2,
            score: `${match.score.player1} - ${match.score.player2}`,
          });
          match.removeIt = true;
        }
      }
      const toRemoveEntries = Object.entries(this.activeMatches).filter(
        ([key, gameInstance]) => gameInstance.removeIt,
      );

      toRemoveEntries.forEach(([key]) => {
        delete this.activeMatches[key];
      });
    }, 100);
  }

  addUser(user: Player): void {
    this.playerQueue.push(user);
  }

  removeUser(): Player | undefined {
    return this.playerQueue.shift();
  }

  getAllUsers(): Player[] {
    return this.playerQueue;
  }

  createMatch(player1: Player, player2: Player): void {
    const matchKey = `${player1.user.id}-${player2.user.id}`;
    const match = new Match(player1.socket, player2.socket);
    this.activeMatches[matchKey] = match;
    setTimeout(() => match.gameStart(), 3000);
  }

  readyForGame() {
    setTimeout(() => {
      if (this.getAllUsers().length == 1)
        this.removeUser().socket.emit('nta wahid');
    }, 10000);
    if (this.getAllUsers().length >= 2) {
      const client1 = this.removeUser();
      client1.socket.emit('opponentFound', {
        playerPosition: 'leftPaddle',
        id: client1.id,
      });
      const client2 = this.removeUser();
      client2.socket.emit('opponentFound', {
        playerPosition: 'rightPaddle',
        id: client2.id,
      });
      this.createMatch(client1, client2);
    }
  }

  removeUserById(userId: number): void {
    this.playerQueue = this.playerQueue.filter(
      (player) => player.user.id !== userId,
    );
  }

  async saveMatch(data: CreateGameDto) {
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
}
