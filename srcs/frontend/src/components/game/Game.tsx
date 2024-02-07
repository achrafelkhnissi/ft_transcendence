'use client';
import React, { useEffect, useState, useContext } from 'react';
import Phaser from 'phaser';
import { Game as GameType } from 'phaser';
import { useSocket } from '../../contexts/socketContext';

const Game = (props: any) => {
  const { socket } = useSocket();
  // const socket = props.socket;
  const playerPosition = props.position;
  const RESOLUTION = { width: 800, height: 400 };
  const TARGET_FPS = 60;

  const [game, setGame] = useState<GameType>();

  // if (!playerPosition){
  //   return (<>
  //   <div>Player not found</div>
  //   </>)
  // }

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import('phaser');
      const { default: Preloader } = await import('./Preloader');
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
            mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          scene: [
            Preloader,
            new GameScene({ key: 'gamescene' }, socket, playerPosition),
          ],
        });
        setGame(PhaserGame);
        return () => {
          // setReady(false)
          console.log('game distroyed');
          PhaserGame.destroy(true);
        };
      }
    }
    initPhaser();
  }, [socket]);

  return (
    <>
      <div
        className="max-w-[800px] max-h-[400px]"
        id="game-container"
        key="game-container"
      ></div>
    </>
  );
};

export default Game;
