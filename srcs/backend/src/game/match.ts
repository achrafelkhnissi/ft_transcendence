import { Socket } from 'socket.io';
import Matter, { Engine, World, Bodies, Body, Events, Vector } from 'matter-js';
import {
  BALLPOSITION,
  BALLRADIUS,
  GAMEHEIGHT,
  GAMEWIDTH,
  PADDLE1_POSITION,
  PADDLE2_POSITION,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  SPEED,
} from './game.constants';
import { GameService } from './game.service';
import { Status } from '../common/enums/status.enum';

enum players { Player1, Player2}

interface Player {
  socket: Socket;
  id: number;
}

export class Match {
  private engine: Matter.Engine;
  private world: Matter.World;
  private leftPaddle: Matter.Body;
  private rightPaddle: Matter.Body;
  private ball: Matter.Body;
  private speed: number;
  private loop: string | number | NodeJS.Timeout;
  public score: { player1: number; player2: number };
  public isFinished: boolean;

  constructor(
    public player1: Player,
    public player2: Player,
    readonly gameService: GameService,
  ) {

    this.gameService.toggleUserStatus(player1.id, Status.PLAYING);
    this.gameService.toggleUserStatus(player2.id, Status.PLAYING);
    this.isFinished = false;
    this.score = { player1: 0, player2: 0 };
    this.engine = Engine.create();
    this.world = this.engine.world;

    this.engine.gravity.y = 0;
    this.engine.gravity.x = 0;

    this.leftPaddle = Bodies.rectangle(
      PADDLE1_POSITION.x,
      PADDLE1_POSITION.y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      { isStatic: true, label: 'paddle1' },
    );
    this.rightPaddle = Bodies.rectangle(
      PADDLE2_POSITION.x,
      PADDLE2_POSITION.y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      { isStatic: true, label: 'paddle2' },
    );

    this.ball = Bodies.circle(BALLPOSITION.x, BALLPOSITION.y, BALLRADIUS, {
      friction: 0.01,
      restitution: 0.9,
    });

    Body.setVelocity(this.ball, {
      x: (Math.random() > 0.5 ? 1 : -1) * SPEED,
      y: (Math.random() > 0.5 ? 1 : -1) * SPEED,
    });

    World.add(this.world, [this.leftPaddle, this.rightPaddle, this.ball]);
    this.speed = SPEED;

    player1.socket.on('sendMyPaddlePosition', (data: { x: number; y: number }) => {
      const { x, y } = data;
      Body.setPosition(this.leftPaddle, { x, y });
      player2.socket.emit('updateOpponentPaddle', data);
    });

    player2.socket.on('sendMyPaddlePosition', (data: { x: number; y: number }) => {
      const { x, y } = data;
      Body.setPosition(this.rightPaddle, { x, y });
      player1.socket.emit('updateOpponentPaddle', data);
    });

    player1.socket.on('disconnect', () => {
      this.score.player1 = 0;
      this.score.player2 = 1;
      this.setWinner(players.Player2);
      this.endGame();
      console.log('player1.socket Disconnect');
    });

    player2.socket.on('disconnect', () => {
      this.score.player1 = 1;
      this.score.player2 = 0;
      this.setWinner(players.Player1);
      this.endGame();
      console.log('player2.socket Disconnect');
    });
  }

  private Collision(paddle: Matter.Body) {
    let collidePoint = this.ball.position.y - paddle.position.y;
    collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
    const angleRad = (Math.PI / 4) * collidePoint;
    const direction = this.ball.position.x < GAMEWIDTH / 2 ? 1 : -1;
    const velocity = {
      x: direction * this.speed * Math.cos(angleRad),
      y: this.speed * Math.sin(angleRad),
    };
    Body.setVelocity(this.ball, velocity);
    this.speed += 1;
  }

  private resetGame() {
    this.speed = SPEED;
    Body.setPosition(this.ball, BALLPOSITION);
    Body.setVelocity(this.ball, {
      x: (Math.random() > 0.5 ? 1 : -1) * this.speed,
      y: (Math.random() > 0.5 ? 1 : -1) * this.speed,
    });
  }

  public gameStart() {
    console.log('game start');
    Events.on(this.engine, 'collisionStart', (event) => {
      const pair = event.pairs[0];
      const object = pair.bodyA === this.ball ? pair.bodyB : pair.bodyA;
      this.Collision(object);
    });

    Events.on(this.engine, 'afterUpdate', () => {
      if (this.ball.position.x + BALLRADIUS > GAMEWIDTH + 100) {
        this.score.player1 += 1;
        this.updateScore();
        this.resetGame();
      } else if (this.ball.position.x - BALLRADIUS < -100) {
        this.score.player2 += 1;
        this.updateScore();
        this.resetGame();
      }

      if (this.score.player1 == 5) {
        this.setWinner(players.Player1);
        this.endGame();
      } else if (this.score.player2 == 5) {
        this.setWinner(players.Player2);
        this.endGame();
      }

      if (
        this.ball.position.y + BALLRADIUS >= GAMEHEIGHT ||
        this.ball.position.y - BALLRADIUS <= 0
      ) {
        const velocity = this.ball.velocity;
        velocity.y *= -1;
        Body.setVelocity(this.ball, velocity);
      }
      const magnitude = Vector.magnitude(this.ball.velocity);
      Body.setVelocity(this.ball, {
        x: (this.ball.velocity.x / magnitude) * this.speed,
        y: (this.ball.velocity.y / magnitude) * this.speed,
      });

      this.ballPosition();
    });
    this.updateGame();
  }

  private ballPosition() {
    const data = { x: this.ball.position.x, y: this.ball.position.y };
    this.player1.socket.emit('updateBallState', data);
    this.player2.socket.emit('updateBallState', data);
  }

  private updateScore() {
    const data = {
      scorePlayer1: this.score.player1,
      scorePlayer2: this.score.player2,
    };
    this.player1.socket.emit('updateScore', data);
    this.player2.socket.emit('updateScore', data);
  }

  private updateGame() {
    this.loop = setInterval(() => {
      Engine.update(this.engine, 1000 / 60);
    }, 1000 / 60);
  }

  private async endGame() {
    World.remove(this.world, [this.leftPaddle, this.rightPaddle, this.ball]);
    World.clear(this.world, false);
    Engine.clear(this.engine);
    clearInterval(this.loop);
    this.player1.socket.removeAllListeners();
    this.player2.socket.removeAllListeners();
    await this.gameService.saveMatch({
      winnerId: this.score.player1 > this.score.player2 ? this.player1.id : this.player2.id,
      loserId: this.score.player1 < this.score.player2 ? this.player1.id : this.player2.id,
      score: `${this.score.player1} - ${this.score.player2}`,
    });
    await this.gameService.toggleUserStatus(this.player1.id, Status.ONLINE);
    await this.gameService.toggleUserStatus(this.player2.id, Status.ONLINE);
    this.isFinished = true;
    console.log('endgame');
  }

  private setWinner(player: Number) {
    if (player === players.Player1) {
      this.player1.socket.emit('Game is finished', { youWon: true });
      this.player2.socket.emit('Game is finished', { youWon: false });
    } else if (player === players.Player2) {
      this.player1.socket.emit('Game is finished', { youWon: false });
      this.player2.socket.emit('Game is finished', { youWon: true });
    }
  }
}
