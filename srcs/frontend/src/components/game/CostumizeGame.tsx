import { SetStateAction } from 'react';
import TableCard from './TableCartd';

interface CostumizeGameProps {
  setBgColor: Function;
}

const CostumizeGame: React.FC<CostumizeGameProps> = ({ setBgColor }) => {
  return (
    <div
      className="
        w-full h-full
        flex flex-col  
        gap-12 
        justify-center
        self-center
        "
    >
      <h1 className="text-white text-[45px] font-bold self-center ">
        Costumize Your Game
      </h1>
      <div className="flex gap-6 md:gap-12 self-center flex-wrap justify-center">
        <TableCard
          imageSrc="pongTableSkyBlue.png"
          setBgColor={setBgColor}
          color="#42A5FF"
        />
        <TableCard
          imageSrc="pongTable.png"
          setBgColor={setBgColor}
          color="#090960"
        />
        <TableCard
          imageSrc="pongTableViolet.png"
          setBgColor={setBgColor}
          color="#6C61A4"
        />
      </div>
    </div>
  );
};
export default CostumizeGame;
