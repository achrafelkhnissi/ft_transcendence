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

export class Match {
  private engine: Matter.Engine;
  private world: Matter.World;
  private leftPaddle: Matter.Body;
  private rightPaddle: Matter.Body;
  private ball: Matter.Body;
  private speed: number;
  private loop: string | number | NodeJS.Timeout;
  public score: { player1: number; player2: number };

  constructor(
    public player1: Socket,
    public player2: Socket,
  ) {
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
      friction: 1,
      restitution: 0.1,
    });

    Body.setVelocity(this.ball, {
      x: (Math.random() > 0.5 ? 1 : -1) * SPEED,
      y: (Math.random() > 0.5 ? 1 : -1) * SPEED,
    });

    World.add(this.world, [this.leftPaddle, this.rightPaddle, this.ball]);
    this.speed = SPEED;

    player1.on('sendMyPaddlePosition', (data: { x: number; y: number }) => {
      const { x, y } = data;
      Body.setPosition(this.leftPaddle, { x, y });
      console.log('positionleft ', data, ' ', this.leftPaddle.position);
      player2.emit('updateOpponentPaddle', data);
    });

    player2.on('sendMyPaddlePosition', (data: { x: number; y: number }) => {
      const { x, y } = data;
      Body.setPosition(this.rightPaddle, { x, y });
      console.log('positionRight ', data, ' ', this.rightPaddle.position);
      player1.emit('updateOpponentPaddle', data);
    });

    player1.on('disconnect', () => {
      this.score.player1 = 0;
      this.score.player2 = 1;
      this.endGame();
      console.log('Disconnect');
    });

    player2.on('disconnect', () => {
      this.score.player1 = 1;
      this.score.player2 = 0;
      this.endGame();
      console.log('Disconnect');
    });
  }

  private Collision(paddle: Matter.Body) {
    // console.log("colide");
    let collidePoint =
      this.ball.position.y - (paddle.position.y + PADDLE_HEIGHT / 2);
    collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
    const angleRad = (Math.PI / 4) * collidePoint;
    const direction = this.ball.position.x < GAMEWIDTH / 2 ? 1 : -1;
    const velocity = {
      x: direction * this.speed * Math.cos(angleRad),
      y: this.speed * Math.sin(angleRad),
    };
    // console.log(paddle.position);
    Body.setVelocity(this.ball, velocity);
    this.speed += 0.01;
  }

  private resetGame() {
    Body.setPosition(this.ball, BALLPOSITION);
    Body.setVelocity(this.ball, {
      x: (Math.random() > 0.5 ? 1 : -1) * this.speed,
      y: (Math.random() > 0.5 ? 1 : -1) * this.speed,
    });
  }

  public gameStart() {
    Events.on(this.engine, 'collisionStart', (event) => {
      console.log('position ', this.rightPaddle.position.y);
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

      if (this.score.player1 == 10) {
        console.log('this.score.player1', this.score.player1);
        console.log('this.score.player2', this.score.player2);
        this.setWinner(1);
        this.endGame();
      } else if (this.score.player2 == 10) {
        console.log('this.score.player1', this.score.player1);
        console.log('this.score.player2', this.score.player2);
        this.setWinner(2);
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
    this.player1.emit('updateBallState', data);
    this.player2.emit('updateBallState', data);
  }

  private updateScore() {
    const data = {
      scorePlayer1: this.score.player1,
      scorePlayer2: this.score.player2,
    };
    this.player1.emit('updateScore', data);
    this.player2.emit('updateScore', data);
  }

  private updateGame() {
    this.loop = setInterval(() => {
      Engine.update(this.engine, 1000 / 60);
    }, 1000 / 60);
  }

  private endGame() {
    World.remove(this.world, [this.leftPaddle, this.rightPaddle, this.ball]);
    World.clear(this.world, false);
    Engine.clear(this.engine);
    clearInterval(this.loop);
    this.player1.removeAllListeners();
    this.player2.removeAllListeners();
    console.log('endgame');
  }

  private setWinner(player: Number) {
    if (player === 1) {
      this.player1.emit('Game is finished', { youWon: true });
      this.player2.emit('Game is finished', { youWon: false });
    } else {
      this.player1.emit('Game is finished', { youWon: false });
      this.player2.emit('Game is finished', { youWon: true });
    }
  }
}