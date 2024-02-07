'use client';

import Image from 'next/image';
import { useState } from 'react';

interface TableCardPorps {
  imageSrc: string;
  color?: string;
  setBgColor: Function;
}

const TableCard: React.FC<TableCardPorps> = ({
  imageSrc,
  color,
  setBgColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="
                    w-[25rem] 
                    rounded-[2.5rem] 
                    p-[0.7rem] 
                    bg-[#3A386A] 
                    shadow-xl 
                    transition ease-in-out duration-500
                    hover:scale-110 
                    hover:shadow-2xl
                    relative
                    flex justify-center
                    self-center
    "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={`/images/${imageSrc}`}
        alt="channel image"
        width={1200}
        height={600}
        priority
        className={`object-cover 
                    w-auto
                    h-auto
                    self-center
                    rounded-[2rem]
                    ${isHovered && 'filter blur-sm'}
                    transition ease-in-out duration-500
                    `}
      />

      <button
        className={`text-white 
                            absolute 
                            left-1/2 
                            top-1/2 
                            transform 
                            -translate-x-1/2
                            bg-[#6257FE]
                            px-[1.6rem]
                            py-[0.4rem]
                            rounded-[0.6rem]
                            font-semibold
                            text-sm
                            transition ease-in-out delay-100 duration-500
                            shadow-[inset_0_12px_11px_rgba(255,255,255,0.26)]
                            ${!isHovered && 'hidden'}
                            `}
        onClick={() => {
          setBgColor(color);
          console.log('color:', color);
        }}
      >
        select
      </button>
    </div>
  );
};

export default TableCard;
