'use client';
import { useState, useEffect, useCallback } from 'react';

import { useSocket } from '../../../contexts/socketContext';
import Game from '../../../components/game/Game';
import CostumizeGame from '@/components/game/CostumizeGame';
import { RxExit } from 'react-icons/rx';
import Link from 'next/link';
import PlayerNotFound from '@/components/game/PlayerNotFound';
import YouWon from '@/components/game/YouWon';
import YouLose from '@/components/game/YouLose';
import { User } from '@/components/userProfile/types';
import getCurrentUser from '@/services/getCurrentUser';
import { useRouter } from 'next/navigation';

const DEFAUL_TCOLOR: string = '#000000';

const PlayPage = ({ params }: { params: { gameRoom: string } }) => {
  const { socket } = useSocket();
  const router = useRouter();
  const [isWaiting, setIsWaiting] = useState(false);
  const [bgColor, setBgColor] = useState<string>(DEFAUL_TCOLOR);
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
    games: [],
    isFriend: false,
    friends: [],
  });

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res) {
        console.log(res);
        setCurrentUser(res);
      }
    });
  }, [gameisFinished]);

  const [GameInfo, setgameInfo] = useState({
    position: '',
    OpponentId: 0,
  });

  const handlePlayClick = () => {
    console.log('play clicked');
    setIsWaiting(true);
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('params ', params);
    console.log('params.gameRoom ', params.gameRoom);
    if (params.gameRoom[0] !== '0') {
      console.log('hanaaa froooom');
      socket?.emit('joinRoom', params.gameRoom);
    } else {
      socket?.emit('joinQueue');
      console.log('join Queue');
    }
  };

  const handleOpponentFound = useCallback(
    (opponentInfo: {
      playerPosition: string;
      opponentId: number;
      username: string;
    }) => {
      console.log('start game', opponentInfo);
      setgameInfo({
        position: opponentInfo.playerPosition,
        OpponentId: opponentInfo.opponentId,
      });
      setIsWaiting(false);
    },
    [], // Empty dependency array means no external dependencies for memoization
  );
  useEffect(() => {
    socket?.on('start game', handleOpponentFound);

    socket?.on('nta wahid', () => {
      console.log('nta wahid');
      setPlayerNotFound(true);
    });

    socket?.on('already in the game', ()=>{
      setIsWaiting(false);
    })

    socket?.on('Game is finished', (state) => {
      console.log('you won ', state);
      setGameisFinished({ gameisFinished: true, youWon: state.youWon });
    });

    return () => {
      if (socket) {
        socket.off('Game is finished', () => {});
        socket.off('start game', handleOpponentFound);
        socket?.off('nta wahid', () => console.log('nta wahid'));
        socket?.off('already in the game');
      }
    };
  }, [socket, handleOpponentFound]);

  return (
    <div className={`flex justify-center w-full h-full relative border-0`}>
      <Link href="/dashboard">
        <RxExit className="md:h-10 md:w-8 text-white/80 absolute md:top-4 top-1 md:right-4 right-2 h-8 w-6" />
      </Link>
      {GameInfo.OpponentId === 0 && (
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
      `}
          >
            Play
          </button>
          {playerNotFound && (
            <div
              className={`absolute w-full h-full flex justify-center ${playerNotFound && 'blur-container'} `}
              onClick={() => {
                window.location.reload();
              }}
            >
              <PlayerNotFound />
            </div>
          )}
        </div>
      )}

      {gameisFinished && (
        <div
          className={`absolute w-full h-full flex justify-center ${gameisFinished && 'blur-container'} `}
          onClick={() => {
            router.push('/dashboard');
          }}
        >
          {(youWon && <YouWon user={currentUser} />) ||
            (!youWon && <YouLose user={currentUser} />)}
        </div>
      )}

      {!isWaiting && GameInfo.OpponentId !== 0 && (
        <>
          <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 ">
            {GameInfo.position == 'leftPaddle' && (
              <div className="flex justify-center h-20 rounded-t-[2rem] gap-x-60">
                <img
                  src={
                    process.env.BACKEND + `/api/users/${currentUser.id}/avatar`
                  }
                  alt="player"
                  width={10}
                  height={10}
                  className="w-20 h-20 rounded-full self-center"
                />
                <img
                  src={
                    process.env.BACKEND +
                    `/api/users/${GameInfo.OpponentId}/avatar`
                  }
                  alt="opponent"
                  width={10}
                  height={10}
                  className="w-20 h-20 rounded-full self-center"
                />
              </div>
            )}
            {GameInfo.position == 'rightPaddle' && (
              <div className="flex justify-center h-20 rounded-t-[2rem] gap-x-60">
                <img
                  src={
                    process.env.BACKEND +
                    `/api/users/${GameInfo.OpponentId}/avatar`
                  }
                  alt="opponent"
                  width={10}
                  height={10}
                  className="w-20 h-20 rounded-full self-center"
                />
                <img
                  src={
                    process.env.BACKEND + `/api/users/${currentUser.id}/avatar`
                  }
                  alt="player"
                  width={10}
                  height={10}
                  className="w-20 h-20 rounded-full self-center"
                />
              </div>
            )}
          </div>
          <Game position={GameInfo.position} color={bgColor} />
        </>
      )}
    </div>
  );
};

export default PlayPage;