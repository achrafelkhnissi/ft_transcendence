/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState, useContext } from 'react';
import Phaser from 'phaser';
import { Game as GameType } from 'phaser';
import { useSocket } from '../../contexts/socketContext';

const Game = (props: any) => {
  const { socket } = useSocket();
  const playerPosition = props.position;
  const RESOLUTION = { width: 1400, height: 700 };
  const TARGET_FPS = 60;

  const [game, setGame] = useState<GameType>();

  useEffect(() => {
    async function initPhaser() {
      try {
        const Phaser = await import('phaser');
        const { default: GameScene } = await import('./GameScene');
        if (socket) {
          const gamescene = new GameScene(
            { key: 'gamescene' },
            socket,
            playerPosition,
          );
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
            scene: gamescene,
          });
          setGame(PhaserGame);
          return () => {
            if (PhaserGame) {
              PhaserGame.destroy(true);
              PhaserGame.scene?.remove('gamescene');
            }
          };
        }
      } catch (e) {
        console.error('Error loading phaser', e);
      }
    }
    initPhaser();
  }, [socket]);

  return (
    <div
      className="max-w-[1400px] max-h-[700px] self-center max-[500px]:mb-40"
      id="game-container"
      key="game-container"
    ></div>
  );
};

export default Game;
