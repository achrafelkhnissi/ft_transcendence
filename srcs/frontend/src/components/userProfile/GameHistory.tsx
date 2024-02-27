/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Card from './Card';
import { RiChatHistoryFill } from 'react-icons/ri';
import { AiFillCloseCircle, AiFillCheckCircle } from 'react-icons/ai';
import { GameHistoryProps } from './types';
import { use } from 'matter';

interface HistroyProps {
  history: GameHistoryProps[];
  userId: number | null;
}

const GameHistory: React.FC<HistroyProps> = ({history, userId}) => {
  return (
    <Card
    header="game history"
    icon={<RiChatHistoryFill className="text-[#6C61A4] w-5 h-5" />}
    >
      <div className="flex gap-1 flex-col-reverse justify-end p-4  h-full min-h-[480px] max-h-[680px] w-full">
        {history.map((item, index) => {
      const oponenent = item.winner.id == userId ? item.loser : item.winner;
          return (
            <div
              key={index}
              className={`
                 w-full h-16 rounded-full py-2
                 flex justify-around
                 
                  ${!(index % 2) && 'bg-[#1C1C43]'}`}
            >
              <div className="flex gap-4 text-white text-sm">
                <img
                  src={process.env.BACKEND + `/api/users/${oponenent.id}/avatar`}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 
                                      object-cover
                                      self-center
                                      rounded-full"
                />
                <p className="self-center">{oponenent.username}</p>
              </div>
              <div className="text-white self-center text-sm">
                {item.score}
              </div>
              <div
                className={`self-center text-sm font-semibold center 
                                ${item.loser.id == userId ? 'text-red-400' : ' text-green-400 '}`}
              >
                {item.loser.id == userId? (
                  <AiFillCloseCircle />
                ) : (
                  <AiFillCheckCircle />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default GameHistory;
