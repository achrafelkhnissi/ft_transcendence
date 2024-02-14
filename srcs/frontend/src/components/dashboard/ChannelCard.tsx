/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PopularRoomstype } from './PopularRooms';
import addMember from '@/services/addMember';
import { join } from 'path';
import joinChannel from '@/services/joinChannel';
import { useRouter } from 'next/navigation';
import { FaCheck } from 'react-icons/fa';
import { hashPassword } from '../messages/hashPass';

interface ChannelCardPorps {
  channel: PopularRoomstype;
}

const ChannelCard: React.FC<ChannelCardPorps> = ({ channel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState('');
  const [showPassInput, setShowPassInput] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleJoinChannel = async () => {
    if (channel.joined) {
      router.push(`/messages/${channel.id}`);
      return;
    }
    if (channel.type === 'PROTECTED' && password == '') {
      setShowPassInput(true);
    } else {
      joinChannel(channel.id, { password: password }).then((data) => {
        setPassword('');
        if (data) {
          router.push(`/messages/${channel.id}`);
        } else {
          setError('Invalid password');
          setTimeout(() => {
            setError('');
          }, 1500);
        }
      });
    }
  };

  return (
    <div
      className={`h-[15rem] 
                    w-[16rem] 
                    rounded-[4.5rem] 
                    p-[0.7rem] 
                    bg-[#3A386A] 
                    shadow-xl 
                    transition ease-in-out duration-500
                    hover:scale-110 
                    hover:shadow-2xl
                    relative
    `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => showPassInput && setShowPassInput(false)}
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
                    ${(isHovered || showPassInput) && 'filter blur-sm'}
                    transition ease-in-out duration-500
                    `}
      />

      <div className=" w-full flex flex-col justify-center text-center pt-2 text-white text-xs">
        <p className="font-semibold text-sm">{channel.name}</p>
        <p className="text-[#9081dc]">
          members: <span className="text-white ">{channel.members}</span>
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
                            ${(!isHovered || showPassInput) && 'hidden'}
                            `}
        onClick={handleJoinChannel}
      >
        {channel.joined ? 'chat' : 'Join'}
      </button>
      {showPassInput && (
        <div
          className="w-full h-[7rem] absolute top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2
       rounded-xl flex justify-center cursor-pointer "
          onClick={(e) => e.stopPropagation()}
        >
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleJoinChannel();
              }
            }}
            type="password"
            className="h-[2.1rem] w-[10rem] self-center rounded-lg bg-[#3A386A] text-white outline-none border-2 border-white/30 text-center
          px-4 md:text-md text-sm"
          />
          {error != '' && (
            <p className=" text-purple-300 absolute bottom-4 text-xs">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChannelCard;
