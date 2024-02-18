'use client';

import FriendAvatar from '../FriendAvatar';
import Card from './Card';
import { MdEmojiPeople } from 'react-icons/md';
import { FriendsProps } from './types';
import { useState } from 'react';
import BlockUser from '../svgAssets/BlockUser';

interface FriendsComponentProps {
  friends: FriendsProps[];
  blockedUsers?: FriendsProps[];
}

const Friends: React.FC<FriendsComponentProps> = ({
  friends,
  blockedUsers,
}) => {
  const [showBlocked, setShowBlocked] = useState(false);

  return (
    <Card
      header={showBlocked ? 'blocked users' : 'friends'}
      icon={
        showBlocked ? (
          <BlockUser color={'#6C61A4'} width={'24px'} height={'24px'} />
        ) : (
          <MdEmojiPeople className="text-[#6C61A4] w-6 h-6" />
        )
      }
    >
      <div
        className="w-full flex gap-4 flex-wrap justify-start py-2 max-h-[280px] pl-4 pr-[0.55rem] 
      relative"
      >
        {!showBlocked &&
          friends.map((item, index) => (
            <FriendAvatar
              key={index}
              name={item.username}
              avatar={process.env.BACKEND + `/api/users/${item.id}/avatar`}
            />
          ))}
        {showBlocked &&
          blockedUsers?.map((item, index) => (
            <div key={index} className="border-2">
              <FriendAvatar
                key={index}
                name={item.username}
                avatar={process.env.BACKEND + `/api/users/${item.id}/avatar`}
              />
            </div>
          ))}
        <p
          className="text-white/80 text-xs absolute -top-3 right-2 font-semibold cursor-pointer px-2 py-1
          rounded-lg bg-white/10"
          onClick={() => {
            setShowBlocked((prev) => !prev);
          }}
        >
          {showBlocked ? 'friends' : 'blocked users'}
        </p>
      </div>
    </Card>
  );
};

export default Friends;
