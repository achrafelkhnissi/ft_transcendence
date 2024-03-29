'use client';

import Image from 'next/image';
import Avatar from '../Avatar';
import ProfileAvatar from './ProfileAvatar';
import UserName from './UserName';
import Stats from './Stats';
import Contacts from './Contacts';
import { User } from './types';

const UserInfo: React.FC<User> = ({
  username,
  stats,
  me,
  isFriend,
  url,
  email,
  id,
}) => {
  return (
    <div className="w-full p-4">
      <div className="w-full relative  h-[400px]">
        <div className="h-[350px] w-full rounded-2xl p-6">
          <Image
            src="/images/profilebg.png"
            width={1200}
            height={600}
            alt="photo"
            className="rounded-[2.5rem] w-full h-full object-cover"
            priority
          />
        </div>
        <div className="absolute w-full h-28 max-[880px]:h-64 bottom-8 rounded-[2.5rem] bg-[#20204A]/90 ">
          <div className="w-full relative h-full flex justify-center">
            <div className="absolute left-1/2 transform  -translate-x-1/2 -translate-y-1/2">
              <ProfileAvatar
                avatar={
                  id ? process.env.BACKEND + `/api/users/${id}/avatar` : ''
                }
                experiencePoints={stats.exp}
                level={stats.level}
              />
            </div>
            <div className=" absolute bottom-2 max-[880px]:top-16">
              <UserName name={username} />
            </div>
            <div
              className="flex justify-between px-12  w-full 
                                max-[880px]:flex-col
                                max-[880px]:justify-end
                                max-[880px]:gap-6
                                max-[880px]:py-4
                                max-[880px]:px-2
                                "
            >
              <div className="self-center">
                <Stats wins={stats.wins} losses={stats.losses} />
              </div>
              <div className="self-center z-10">
                <Contacts
                  email={email}
                  username={username}
                  me={me}
                  status={isFriend}
                  url={url}
                  id={id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
