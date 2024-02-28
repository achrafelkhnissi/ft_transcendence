'use client';

import { Scene } from 'phaser';

import { cursorTo } from 'readline';
import { PADDLE_WIDTH, PADDLE_HEIGHT, BALLRADIUS, PADDLE_SPEED } from './constants';
import { Vector } from 'matter';
import { Socket } from 'socket.io-client';

export default class GameScene extends Scene {
  private CANVAS_HEIGHT: number = 0;
  private CANVAS_WIDTH: number = 0;
  
  private paddle: Phaser.GameObjects.Rectangle | null = null;
  private opponentPaddle: Phaser.GameObjects.Rectangle | null = null;
  private ball: any;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private socket: Socket;
  private playerNumber: string | null;
  
  public background!: Phaser.GameObjects.Image;
  
  private prevY = 0;
  
  constructor(
    config: Phaser.Types.Scenes.SettingsConfig | undefined,
    socket: Socket,
    playerNumber: string | null,
    ) {
      super(config);
      this.socket = socket;
      this.playerNumber = playerNumber;
    }
    
    create() {
      this.CANVAS_HEIGHT = this.sys.canvas.height;
      this.CANVAS_WIDTH = this.sys.canvas.width;

      const middleLine = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff } });
      middleLine.beginPath();
      middleLine.moveTo(this.CANVAS_WIDTH/2, 0);
      middleLine.lineTo(this.CANVAS_WIDTH/2, this.CANVAS_HEIGHT);
      middleLine.strokePath();
      
      const left = this.add.rectangle(
        PADDLE_WIDTH / 2 + 10,
        this.CANVAS_HEIGHT / 2, 
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        0xffffff,
        );
        const right = this.add.rectangle(
          this.CANVAS_WIDTH - PADDLE_WIDTH / 2 - 10,
          this.CANVAS_HEIGHT / 2,
          PADDLE_WIDTH,
          PADDLE_HEIGHT,
          0xffffff,
          );
          const ball = this.add.circle(
            this.CANVAS_WIDTH / 2,
            this.CANVAS_HEIGHT / 2,
            BALLRADIUS,
            0xffffff,
            );
            
            this.physics.add.existing(left);
            this.physics.add.existing(right);
            this.physics.add.existing(ball);
            
            if (this.playerNumber === 'leftPaddle') {
              this.paddle = left;
              this.opponentPaddle = right;
            } else if (this.playerNumber === 'rightPaddle') {
              this.paddle = right;
              this.opponentPaddle = left;
            }

            this.ball = ball;         
            this.socket.on('updateOpponentPaddle', (data: { x: number; y: number }) => {
              const { x, y } = data;
              this.opponentPaddle?.setX(x);
              this.opponentPaddle?.setY(y);
    });

    this.socket.on('updateBallState', (data) => {
      this.ball?.setX(data.x);
      this.ball?.setY(data.y);
    });
  }
  
  update() {
    const newPaddleVelocity = new Phaser.Math.Vector2(0, 0);

    this.input.on('pointermove',  (pointer : any) => {
      this.paddle?.setY(Phaser.Math.Clamp(pointer.y, PADDLE_HEIGHT / 2,
      this.CANVAS_HEIGHT - PADDLE_HEIGHT / 2
      ));
    }, this);
    
    if (this.paddle?.body) this.paddle.body.velocity.y = newPaddleVelocity.y;
    
    if (this.paddle) {
      this.paddle?.setY(
        Phaser.Math.Clamp(
          this.paddle?.y,
          PADDLE_HEIGHT / 2,
          this.CANVAS_HEIGHT - PADDLE_HEIGHT / 2,
        ),
      );
    }

    if (this.paddle?.y != this.prevY) {
      this.socket.emit('sendMyPaddlePosition', {
        x: this.paddle?.x,
        y: this.paddle?.y,
      });
    }
    
    if (this.paddle) this.prevY = this.paddle.y;
  }
  
  destroy() {
    this.socket.removeAllListeners();
  }
}
