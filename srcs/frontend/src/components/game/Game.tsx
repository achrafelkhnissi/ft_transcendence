'use client';
import React, { useEffect, useState, useContext } from 'react';
import Phaser from 'phaser';
import { Game as GameType } from 'phaser';
import { useSocket } from '../../contexts/socketContext';

const Game = (props: any) => {
  const { socket } = useSocket();
  const playerPosition = props.position;
  const RESOLUTION = { width: 1428, height: 700 };
  const TARGET_FPS = 60;

  const [game, setGame] = useState<GameType>();

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import('phaser');
      // const { default: Preloader } = await import('./Preloader');
      const { default: GameScene } = await import('./GameScene');
      console.log('game color', props.color);
      if (socket) {
        const PhaserGame = new Phaser.Game({
          type: Phaser.AUTO,
          width: RESOLUTION.width,
          height: RESOLUTION.height,
          backgroundColor: props.color,
          parent: 'game-container',
          physics: {
            default: 'arcade',
            arcade: {},
          },
          fps: {
            min: TARGET_FPS,
            target: TARGET_FPS,
            deltaHistory: 10,
            smoothStep: true,
          },
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          scene: new GameScene({ key: 'gamescene' }, socket, playerPosition)
        });
        setGame(PhaserGame);
        return () => {
          if (PhaserGame){
            console.log('game destroyed');
            PhaserGame.destroy(true);
          }
        };
      }
    }
    initPhaser();
  }, [socket]);

  return (
      <div
        className="max-w-[1428px] max-h-[700px] self-center border-0"
        id="game-container"
        key="game-container"
      ></div>
  );
};

export default Game;
