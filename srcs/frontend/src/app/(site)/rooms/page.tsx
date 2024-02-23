'use client';

import ChannelCard from '@/components/dashboard/ChannelCard';
import getAllRooms from '@/services/getAllRooms';
import { useEffect, useState } from 'react';
export interface PopularRoomstype {
  id: number;
  name: string;
  type: string;
  members: number;
  joined: boolean;
}

const Home = () => {
  const [channels, setChannels] = useState<PopularRoomstype[]>([]);

  useEffect(() => {
    getAllRooms().then((res) => {
      if (res) {
        setChannels(res);
      }
    });
  }, []);

  return (
    <div className="w-full py-2">
      <p className="text-xl text-white flex justify-center pt-8  pb-4 font-semibold">
        All Rooms
      </p>
      <div className="flex gap-1 pl-4">
        <div className="h-full py-6 flex w-full justify-center gap-6 flex-wrap">
          {channels.map((item, index) => {
            return <ChannelCard key={index} channel={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
