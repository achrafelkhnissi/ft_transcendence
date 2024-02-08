'use client';

import Image from 'next/image';
import { useState } from 'react';

interface TableCardPorps {
  imageSrc: string;
  color?: string;
  setBgColor: Function;
  isSelected?: string;
}

const TableCard: React.FC<TableCardPorps> = ({
  imageSrc,
  color,
  setBgColor,
  isSelected,
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
      className={`
                    md:w-[25rem] 
                    md:h-[14rem]
                    w-[18rem]
                    h-[10rem]
                    md:rounded-[2.5rem] 
                    rounded-[1.5rem]
                    md:p-[0.9rem] 
                    p-[0.7rem]
                    bg-[#3A386A] 
                    shadow-2xl 
                    transition ease-in-out duration-500
                    hover:scale-110 
                    ${isSelected == color && 'scale-110'}
                    hover:shadow-2xl
                    relative
                    flex justify-center
                    self-center
    `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={`/images/${imageSrc}`}
        alt="channel image"
        width={1200}
        height={600}
        priority
        className={`
        object-fill
                    w-full
                    h-full
                    self-center
                    md:rounded-[2rem]
                    rounded-[1rem]
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
                            bg-[#473fb2]
                            px-[1.4rem]
                            py-[0.4rem]
                            md:px-[1.8rem]
                            md:py-[0.5rem]
                            rounded-[0.6rem]
                            font-semibold
                            md:text-sm
                            text-xs
                            text-white/80
                            transition ease-in-out delay-100 duration-500
                            shadow-[inset_0_12px_11px_rgba(255,255,255,0.26)]
                            ${!isHovered && 'hidden'}
                            `}
        onClick={() => {
          setBgColor(color);
        }}
      >
        select
      </button>
    </div>
  );
};

export default TableCard;
