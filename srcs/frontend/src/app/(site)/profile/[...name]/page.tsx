'use client';

import UserInfo from '../../../../components/userProfile/UserInfo';
import GameHistory from '../../../../components/userProfile/GameHistory';
import Achievements from '../../../../components/userProfile/Achievements';
import Friends from '../../../../components/userProfile/Friends';
import getCurrentUser from '@/services/getCurrentUser';
import { useState } from 'react';
import { useEffect } from 'react';
import getUser from '@/services/getUser';
import {
  BlockedProps,
  FriendsProps,
  User,
  defaultInfos,
} from '@/components/userProfile/types';
import { useRouter } from 'next/navigation';

const Home = ({ params }: { params: { name: string } }) => {
  const [user, setUser] = useState<User>(defaultInfos);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (!res) router.push('/dashboard');
      else {
        const { data } = res;
        setCurrentUserId(data.id);
        if (params.name == 'me' || data.username == params.name) {
          const userData: User = data;
          userData.me = true;
          setUser(userData);
        } else if (
          data.blockedUsers.some(
            (user: BlockedProps) =>
              user.sender.username == params.name ||
              user.receiver.username == params.name,
          )
        ) {
          router.push('/404');
        } else {
          getUser(params.name).then((res) => {
            if (res) {
              const { data } = res;
              if (data.isFriend == 'BLOCKED') router.push('/404');
              const userData: User = data;
              (userData.me = false), setUser(userData);
            } else {
              router.push('/404');
            }
          });
        }
      }
    });
  }, [params.name]);

  return (
    <div className={`p-4`}>
      <UserInfo {...user} />
      <div
        className="px-4 w-full h-full grid grid-flow-col grid-rows-2 gap-[1.25rem] max-[880px]:grid-flow-row 
      max-[880px]:grid-rows-3  min-[880px]:grid-cols-2"
      >
        <div className="min-[880px]:row-span-2 ">
          <GameHistory history={user.games} userId={user.id} />
        </div>
        <Friends
          friends={user.friends}
          blockedUsers={user.blockedUsers ?? []}
          me={user.me}
          currentUserId={currentUserId}
        />
        <Achievements />
      </div>
    </div>
  );
};

export default Home;
