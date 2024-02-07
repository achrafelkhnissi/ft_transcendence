'use client';
import { useState, useContext, useEffect, SetStateAction } from 'react';
import { useSocket } from '../../contexts/socketContext';
import Game from '../../components/game/Game';
import PongTable from '@/components/svgAssets/PongTable';
import Image from 'next/image';
import CostumizeGame from '@/components/game/CostumizeGame';

const PlayPage = () => {
  const { socket } = useSocket();
  const [position, setPosition] = useState<null | string>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [bgColor, setBgColor] = useState<string>('#000000');

  const handlePlayClick = async () => {
    setIsWaiting(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    socket?.emit('joinQueue', () => {
      console.log('joinQueue');
      console.log(socket);
    });
  };

  useEffect(() => {
    const handleOpponentFound = (opponentInfo: {
      playerPosition: string;
      id: string;
    }) => {
      console.log('Opponent found:', opponentInfo);
      setPosition(opponentInfo.playerPosition);
      setIsWaiting(false);
    };
    socket?.on('opponentFound', handleOpponentFound);

    return () => {
      if (socket) {
        socket.off('opponentFound', handleOpponentFound);
      }
    };
  }, [socket]);

  return (
    <>
      {!position && (
        <div className=" flex flex-col justify-center w-full h-full md:gap-20 gap-4">
          <div className="text-center p-4 flex justify-center">
            <CostumizeGame setBgColor={setBgColor} />
          </div>
          <button
            onClick={handlePlayClick}
            disabled={isWaiting}
            className={`text-white 
                            mx-auto
                            bg-[#6257FE]
                            md:px-[2.8rem]
                            md:py-[0.6rem]
                            px-[2.5rem]
                            py-[0.5rem]
                            rounded-[0.6rem]
                            font-semibold
                            text-md
                            md:text-2xl
                            shadow-[inset_0_12px_11px_rgba(255,255,255,0.26)]
                            ${isWaiting ? 'opacity-50 cursor-not-allowed' : ''}
                            {isWaiting ? 'Finding Opponent...' : 'Play'}

      `}
          >
            Play
          </button>
        </div>
      )}
      {/* // {isWaiting && <div className="mt-4 spinner">Loading...</div>} popup  */}
      {/* // )} */}
      {!isWaiting && position && <Game position={position} color={bgColor} />}
    </>
  );
};

export default PlayPage;
