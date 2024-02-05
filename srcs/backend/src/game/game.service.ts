import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Match } from './match';

interface Player {
  id: string;
  socket: Socket;
}

@Injectable()
export class GameService {
  private activeMatches: { [key: string]: Match } = {};
  private playerQueue: Player[] = [];

  addUser(user: Player): void {
    this.playerQueue.push(user);
  }

  removeUser(): Player | undefined {
    return this.playerQueue.shift();
  }

  getAllUsers(): Player[] {
    return this.playerQueue;
  }

  createMatch(player1: Socket, player2: Socket): void {
    // Generate a unique key for the match using player IDs
    const matchKey = `${player1.id}-${player2.id}`;

    const match = new Match(player1, player2);

    this.activeMatches[matchKey] = match;
    setTimeout(() => match.gameStart(), 2000);
    // match.gameStart();
  }

  // readyForGame(){
  //   if (this.getAllUsers().length >= 2){
  //     const client1 = this.removeUser().socket;
  //     client1.emit('playerNumber', {playerNumber : 1 , id : client1.id});
  //     const client2 = this.removeUser().socket;
  //     client2.emit('playerNumber', {playerNumber : 2 , id : client1.id});
  //     this.createMatch(client1, client2);
  //   }
  // }

  removeUserById(userId: string): void {
    this.playerQueue = this.playerQueue.filter((user) => user.id !== userId);
  }
}
