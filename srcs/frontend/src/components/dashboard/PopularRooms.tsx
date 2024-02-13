'use client';
import { AiFillFire } from 'react-icons/ai';
import ChannelCard from './ChannelCard';
import { useEffect, useState } from 'react';
import { Conversation } from '../messages/data';
import getPoularRooms from '@/services/getPopularRooms';

export interface PopularRoomstype {
  id: number;
  name: string;
  type: string;
  members: number;
  joined: boolean;
}

const PopularRooms = () => {
  const [channels, setChannels] = useState<PopularRoomstype[]>([]);

  useEffect(() => {
    getPoularRooms().then((data) => {
      console.log('data', data);
      if (data) {
        setChannels(data);
      }
    });
  }, []);

  return (
    <div className="w-full py-2">
      <div className="flex gap-1 pl-4">
        <AiFillFire className="text-[#E89B05]" />
        <p className="text-white font-semibold"> Popular Rooms Today </p>
      </div>
      <div className="h-full py-6 flex justify-center gap-6 flex-wrap">
        {channels?.map((item, index) => {
          return <ChannelCard key={index} channel={item} />;
        })}
      </div>
    </div>
  );
};

export default PopularRooms;
