/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PopularRoomstype } from './PopularRooms';
import addMember from '@/services/addMember';
import { join } from 'path';
import joinChannel from '@/services/joinChannel';
import { useRouter } from 'next/navigation';

interface ChannelCardPorps {
  channel: PopularRoomstype;
}

const ChannelCard: React.FC<ChannelCardPorps> = ({ channel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleJoinChannel = () => {
    console.log('join channel');
    if(channel.joined){
      router.push(`/messages/${channel.id}`);
      return;
    }
    joinChannel(channel.id, null).then((data) => {
      console.log('data', data);
      if (data) {
        console.log('joined');
        router.push(`/messages/${channel.id}`);
      }
    })
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
      <img
        src={process.env.BACKEND + `/api/users/chat/${channel.id}/avatar`}
        alt="channel image"
        width={1200}
        height={600}
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
        <p className="font-semibold text-sm">{channel.name}</p>
        <p className="text-[#9081dc]">
          members:{' '}
          <span className="text-white ">
            {channel.members}
          </span>
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
      onClick={handleJoinChannel}
      >
        { channel.joined? 'chat' : 'Join'}
      </button>
      <div className='w-full h- border-2 absolute'>

      </div>
    </div>
  );
};

export default ChannelCard;
