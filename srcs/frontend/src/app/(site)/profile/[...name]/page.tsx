'use client';

import UserInfo from '../../../../components/userProfile/UserInfo';
import GameHistory from '../../../../components/userProfile/GameHistory';
import Achievements from '../../../../components/userProfile/Achievements';
import Friends from '../../../../components/userProfile/Friends';
import getCurrentUser from '@/services/getCurrentUser';
import { useState } from 'react';
import { useEffect } from 'react';
import getUser from '@/services/getUser';
import { User, defaultInfos } from '@/components/userProfile/types';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/contexts/socketContext';

const Home = ({ params }: { params: { name: string } }) => {
  const abortController = new AbortController();
  const [user, setUser] = useState<User>(defaultInfos);
  const router = useRouter();

  useEffect(() => {
    if (params.name == 'me') {
      getCurrentUser().then((res) => {
        const userData: User = res;
        userData.me = true;
        setUser(userData);
      });
    } else {
      getUser(params.name).then((res) => {
        if (res) {
          const userData: User = res;
          (userData.me = false), setUser(userData);
        } else {
          router.push('/404');
        }
      });
    }
console.log('user', user)
    return () => abortController.abort();
  }, [params.name]);

  return (
    <div className={`p-4`}>
      <UserInfo {...user} />
      <div
        className="px-4 w-full h-full grid grid-flow-col grid-rows-2 gap-[1.25rem] max-[880px]:grid-flow-row 
      max-[880px]:grid-rows-3  min-[880px]:grid-cols-2"
      >
        <div className="min-[880px]:row-span-2 ">
          <GameHistory history={user.games} userId={user.id}/>
        </div>
        <Friends friends={user.friends} blockedUsers={user.blockedUsers}/>
        <Achievements />
      </div>
    </div>
  );
};

export default Home;
