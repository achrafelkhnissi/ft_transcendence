/* eslint-disable @next/next/no-img-element */

import { useSocket } from "@/contexts/socketContext";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface gameImage {  
    position: string;
    opponentId: number;
    currentUser: any;
}

const GameImages = (props: gameImage) => {
  
  const {socket} = useSocket();
  const [scorePlayer1, setScorePlayer1] = useState('0');
  const [scorePlayer2, setScorePlayer2] = useState('0');
  useEffect(() => {

    socket?.on('updateScore', (data) => {
     setScorePlayer1(`${data.scorePlayer1}`);
      setScorePlayer2(`${data.scorePlayer2}`);
    });
  }, []);
  return (
      <div className="flex px-4 md:px-8 md:py-4 w-full md:border-4 border-2 border-purple-500/20 rounded-2xl bg-white/10 justify-center">
            {props.position == 'leftPaddle' && (
              <div className="flex  h-20 rounded-t-[2rem] justify-between w-full">
                <img
                  src={
                    process.env.BACKEND + `/api/users/${props.currentUser?.id}/avatar`
                  }
                  alt="player"
                  width={10}
                  height={10}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full self-center"
                />
                <p className="text-white text-xl md:text-[2rem] font-semibold self-center">0{scorePlayer1}</p>
                <p></p>
                <p className="text-white text-xl md:text-[2rem] font-semibold self-center">0{scorePlayer2}</p>
                <img
                  src={
                    process.env.BACKEND +
                    `/api/users/${props.opponentId}/avatar`
                  }
                  alt="opponent"
                  width={10}
                  height={10}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full self-center"
                />
              </div>
            )}
            {props.position == 'rightPaddle' && (
              <div className="flex justify-between h-20 rounded-t-[2rem]  w-full">
                <img
                  src={
                    process.env.BACKEND +
                    `/api/users/${props.opponentId}/avatar`
                  }
                  alt="opponent"
                  width={10}
                  height={10}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full self-center"
                />
                <p className="text-white text-xl md:text-[2rem] font-semibold self-center">0{scorePlayer1}</p>
                <p className="text-white text-xl md:text-[2rem] font-semibold self-center">0{scorePlayer2}</p>
                <img
                  src={
                    process.env.BACKEND + `/api/users/${props.currentUser?.id}/avatar`
                  }
                  alt="player"
                  width={10}
                  height={10}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full self-center"
                />
              </div>
            )}
          </div>
  );
}

export default GameImages;