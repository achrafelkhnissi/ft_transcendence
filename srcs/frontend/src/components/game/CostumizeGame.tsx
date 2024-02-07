import { SetStateAction, useState } from 'react';
import TableCard from './TableCartd';

interface CostumizeGameProps {
  setBgColor: Function;
}

const CostumizeGame: React.FC<CostumizeGameProps> = ({ setBgColor }) => {
  const [isSelected, setIsSelected] = useState('');
  return (
    <div
      className="
        w-full h-full
        flex flex-col  
        md:gap-14
        gap-4
        justify-center
        self-center
        "
    >
      <h1 className="text-white text-xl md:text-[45px] font-bold self-center ">
        Costumize Your Game
      </h1>
      <div className="flex gap-4 md:gap-14 self-center flex-wrap justify-center">
        <div onClick={() => setIsSelected('#42A5FF')}>
          <TableCard
            isSelected={isSelected}
            imageSrc="pongTableSkyBlue.png"
            setBgColor={setBgColor}
            color="#42A5FF"
          />
        </div>
        <div onClick={() => setIsSelected('#090960')}>
          <TableCard
            isSelected={isSelected}
            imageSrc="pongTable.png"
            setBgColor={setBgColor}
            color="#090960"
          />
        </div>
        <div onClick={() => setIsSelected('#6C61A4')}>
          <TableCard
            isSelected={isSelected}
            imageSrc="pongTableViolet.png"
            setBgColor={setBgColor}
            color="#6C61A4"
          />
        </div>
      </div>
    </div>
  );
};
export default CostumizeGame;
