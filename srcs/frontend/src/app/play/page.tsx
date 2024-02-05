'use client'
import { useState, useContext, useEffect } from 'react';
import { useSocket } from "../../contexts/socketContext";
import Game from "../game/page";



const PlayPage = () => {
    const {socket} = useSocket();
    const [position, setPosition] = useState<null | string>(null);
    const [isWaiting, setIsWaiting] = useState(false);

  const handlePlayClick = async () => {
    setIsWaiting(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    socket?.emit("joinQueue", () => {
      console.log("joinQueue");
      console.log(socket);
    });
  
  };

  useEffect(() => {
    const handleOpponentFound = (opponentInfo : {playerPosition : string , id : string}) => {
      console.log('Opponent found:', opponentInfo);
      setPosition(opponentInfo.playerPosition);
      setIsWaiting(false);
    }
    socket?.on('opponentFound', handleOpponentFound);

    return () => {
      if (socket) {
        socket.off('opponentFound', handleOpponentFound);
      }
    };
  }, [socket]);

  return (
    <>
    {!position && (<div className="min-h-screen flex items-center justify-center">
     <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Play Page</h1>
        <button
          onClick={handlePlayClick}
          disabled={isWaiting}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            isWaiting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isWaiting ? 'Finding Opponent...' : 'Play'}
        </button>
        {isWaiting && <div className="mt-4 spinner">Loading...</div>}
      </div>
      </div>)}
      {!isWaiting && position && <Game  position={position}/>}
      </>
  );
};

export default PlayPage;
