import { PrismaService } from './../prisma/prisma.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Match } from './match';
import { CreateGameDto } from './dto/create-game.dto';
import { UserType } from 'src/common/interfaces/user.interface';
import { NotificationsService } from 'src/users/notifications/notifications.service';

interface Player {
  // id: string;
  socket: Socket;
  user: UserType;
}

@Injectable()
export class GameService {
  private activeMatches: { [key: string]: Match } = {};
  public activeRoom: { [key: string]: Player[] } = {};
  private playerQueue: Player[] = [];
  // private currentGamers = new Array<Player>();

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {
    this.updateGame();
  }

  updateGame() {
    setInterval( async () => {
      for (const key in this.activeMatches) {
        const match = this.activeMatches[key];
        if (match.isFinished) {
          const id1: number = parseInt(key.split('-')[0]);
          const id2: number = parseInt(key.split('-')[1]);
          // this.currentGamers = this.currentGamers.filter(
          //   (player) => {return player.user.id !== id1 && player.user.id !== id2},
          //   );
          //   console.log("after delete", this.currentGamers);
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
    // console.log("user id ",user.user.id);
    // console.log("online gamers ", this.currentGamers.length);
    // console.log("Queue Size ", this.playerQueue.length);
    // console.log(this.playerQueue.find((player) => player.user.id === user.user.id));
    // if (
    //   !(this.playerQueue.find((player) => {player.user.id === user.user.id})) &&
    //   !(this.currentGamers.find((player) => {player.user.id === user.user.id}))
    // ){
      this.playerQueue.push(user);
      console.log('player added to thr queue');
    // }
  }

  removeUser(): Player | undefined {
    return this.playerQueue.shift();
  }

  getAllUsers(): Player[] {
    return this.playerQueue;
  }

  createMatch(player1: Player, player2: Player): void {
    console.log("match creat");
    const matchKey = `${player1.user.id}-${player2.user.id}`;
    const match = new Match(player1.socket, player2.socket);
    this.activeMatches[matchKey] = match;
    // this.currentGamers.push(player1);
    // this.currentGamers.push(player2);
    setTimeout(() => match.gameStart(), 5000);
  }

  readyForGame() {
    // setTimeout(() => {
    //   if (this.getAllUsers().length == 1)
    //     this.removeUser().socket.emit('nta wahid');
    // }, 10000);
    let size =this.getAllUsers().length;
    console.log('queue size ',size)
    if (size >= 2) {
      console.log('readyForGame');
      const client1 = this.removeUser();
      const client2 = this.removeUser();
      client1.socket.emit('start game', {
        playerPosition: 'leftPaddle',
        opponentId: client2.user.id,
        username: client2.user.username,
      });
      client2.socket.emit('start game', {
        playerPosition: 'rightPaddle',
        opponentId: client1.user.id,
        username: client1.user.username,
      });
      console.log('event sent');
      this.createMatch(client1, client2);
    } //remove the user if he is offline
  }

  removeUserById(userId: number): void {
    this.playerQueue = this.playerQueue.filter(
      (player) => player.user.id !== userId,
    );
  }

  inviteGame(inviter: Player, invited: Player) {
    console.log('gameroom start')
    // console.log(this.currentGamers);
    // if (
    //   !this.currentGamers.find(
    //     (player) => player.user.id === invited.user.id,
    //     ) &&
    //     !this.currentGamers.find((player) => player.user.id === inviter.user.id)
    //     ) {
        console.log('gameroom start')
        inviter.socket.emit('start game', {
          playerPosition: 'leftPaddle',
          opponentId: invited.user.id,
          username: invited.user.username,
        });
        invited.socket.emit('start game', {
          playerPosition: 'rightPaddle',
          opponentId: inviter.user.id,
          username: inviter.user.username,
        });
        this.createMatch(inviter, invited);
      // }
    //   else if (!response){
    //     invited.socket.emit('invitation refused');
    //   }
    // });
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

  createGameRoomName(playerId1: number, playerId2:number) {
    const sortedIds = [playerId1, playerId2].sort();
    return `room-${sortedIds[0]}-${sortedIds[1]}`;
  }
}
