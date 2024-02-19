'use client';
import { useState, useContext, useEffect, SetStateAction } from 'react';
import { useSocket } from '../../contexts/socketContext';
import Game from '../../components/game/Game';
import PongTable from '@/components/svgAssets/PongTable';
import Image from 'next/image';
import CostumizeGame from '@/components/game/CostumizeGame';
import { RxExit } from 'react-icons/rx';
import Link from 'next/link';
import PlayerNotFound from '@/components/game/PlayerNotFound';
import YouWon from '@/components/game/YouWon';
import YouLose from '@/components/game/YouLose';
import { User } from '@/components/userProfile/types';
import getCurrentUser from '@/services/getCurrentUser';

const PlayPage = () => {
  const { socket } = useSocket();
  const [position, setPosition] = useState<null | string>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [bgColor, setBgColor] = useState<string>('#000000');
  const [playerNotFound, setPlayerNotFound] = useState(false);
  const [{ gameisFinished, youWon }, setGameisFinished] = useState({
    gameisFinished: false,
    youWon: false,
  });
  const [currentUser, setCurrentUser] = useState<User>({
    id: null,
    username: '',
    url: '',
    stats: {
      exp: 0,
      level: 0,
      wins: 0,
      losses: 0,
    },
    me: false,
    isFriend: false,
    games: [],
    friends: [],
  });
  const [opponent, setOpponenet] = useState({
    id: 0,
    username: '',
  });

  const [left, setLeft] = useState<null | number>(null);
  const [right, setRight] = useState<null | number>(null);

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
      opponentId: number;
      username: string;
    }) => {
      console.log('Opponent found:', opponentInfo);
      setOpponenet({
        id: opponentInfo.opponentId,
        username: opponentInfo.username,
      });
      setPosition(opponentInfo.playerPosition);
      // if (position === 'leftPaddle'){
      //   setLeft(currentUser.id);
      //   setRight(opponent.id);
      // }
      // else if (position == 'rightPaddle'){
      //   setLeft(opponent.id);
      //   setRight(currentUser.id);
      // }
      setIsWaiting(false);
    };

    socket?.on('start game', handleOpponentFound);

    socket?.on('nta wahid', () => {
      console.log('nta wahid');
      setPlayerNotFound(true);
    });

    socket?.on('Game is finished', (state) => {
      console.log('you won ', state);
      getCurrentUser().then((res) => setCurrentUser(res)); //protect get current user
      setGameisFinished({ gameisFinished: true, youWon: state.youWon });
    });

    return () => {
      if (socket) {
        socket.off('Game is finished', () => {});
        socket.off('opponentFound', handleOpponentFound);
        socket?.off('nta wahid', () => console.log('nta wahid'));
      }
    };
  }, [socket]);

  return (
    <div className={`flex justify-center w-full h-full relative`}>
      <Link href="/dashboard">
        <RxExit className="md:h-10 md:w-8 text-white/80 absolute md:top-4 top-1 md:right-4 right-2 h-8 w-6" />
      </Link>
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
          {playerNotFound && (
            <div
              className={`absolute w-full h-full flex justify-center ${playerNotFound && 'blur-container'} `}
              onClick={() => {
                setPlayerNotFound(false);
                setIsWaiting(false);
              }}
            >
              <PlayerNotFound />
            </div>
          )}
        </div>
      )}

      {gameisFinished && (
        // <div>
        <div
          className={`absolute w-full h-full flex justify-center ${gameisFinished && 'blur-container'} `}
          onClick={() => {
            setGameisFinished({ gameisFinished: false, youWon: false });
            setPosition(null);
          }}
        >
          {(youWon && <YouWon user={currentUser} />) ||
            (!youWon && <YouLose user={currentUser} />)}
        </div>
      )}

      {!isWaiting && position && (
        <div className="self-center bg-[#17194A] rounded-t-[2rem] shadow-2xl">
          <div className="flex justify-center h-20 rounded-t-[2rem] border-2 gap-x-16">
            {/* <img
          src={process.env.BACKEND + `/api/users/${currentUser.id}/avatar`}
          alt="player"
          width={10}
          height={10}
          className="w-10 h-10 rounded-full self-center"
        />
          <img
          src={process.env.BACKEND + `/api/users/${opponent.id}/avatar`}
          alt="opponenet"
          width={10}
          height={10}
          className="w-10 h-10 rounded-full self-center"
        /> */}
          </div>
          <Game position={position} color={bgColor} />
        </div>
      )}
    </div>
  );
};

export default PlayPage;
