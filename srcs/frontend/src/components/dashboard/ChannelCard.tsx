'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ChannelCardPorps {
  imageSrc: string;
}

const ChannelCard: React.FC<ChannelCardPorps> = ({ imageSrc }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="h-[15rem] 
                    w-[16rem] 
                    rounded-[4.5rem] 
                    p-[0.7rem] 
                    bg-[#3A386A] 
                    shadow-xl 
                    transition ease-in-out duration-500
                    hover:scale-110 
                    hover:shadow-2xl
                    relative
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
                    w-full 
                    h-4/5 
                    rounded-t-[4rem]
                    rounded-b-xl
                    ${isHovered && 'filter blur-sm'}
                    transition ease-in-out duration-500
                    `}
      />

      <div className=" w-full flex flex-col justify-center text-center pt-2 text-white text-xs">
        <p className="font-semibold text-sm">room name</p>
        <p className="text-[#9081dc]">
          online: <span className="text-white ">20</span>
        </p>
      </div>

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
      >
        Join
      </button>
    </div>
  );
};

export default ChannelCard;
