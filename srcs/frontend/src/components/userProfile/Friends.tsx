'use client';

import FriendAvatar from '../FriendAvatar';
import Card from './Card';
import { MdEmojiPeople } from 'react-icons/md';
import { BlockedProps, FriendsProps } from './types';
import { useEffect, useState } from 'react';
import BlockUser from '../svgAssets/BlockUser';
import unblockUser from '@/services/unblockUser';

interface FriendsComponentProps {
  friends: FriendsProps[];
  blockedUsers: BlockedProps[];
  me: boolean;
  currentUserId: number | null;
}

const Friends: React.FC<FriendsComponentProps> = ({
  friends,
  blockedUsers,
  me,
  currentUserId,
}) => {
  const [showBlocked, setShowBlocked] = useState(false);
  const [blockedUsersList, setBlockedUsersList] = useState<BlockedProps[]>([]);

  useEffect(() => {
    setBlockedUsersList(blockedUsers);
  }, [blockedUsers]);

  const handleUnBlock = (id: number) => {
    console.log('unblock', id);
    unblockUser(id).then((res) => {
      if (res) {
        setBlockedUsersList((prev) =>
          prev.filter((item) => item.receiver.id !== id),
        );
      }
    });
  };

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
          me &&
          blockedUsersList?.map(
            (item, index) =>
              currentUserId == item.sender.id && (
                <div
                  key={index}
                  className="relative bg-white/10 rounded-2xl p-2"
                >
                  <div
                    className="text-red-600 absolute top-0 right-1 font-extrabold z-10 cursor-pointer
                  "
                    onClick={() => handleUnBlock(item.receiver.id)}
                  >
                    x
                  </div>
                  <FriendAvatar
                    key={index}
                    name={item.receiver.username}
                    avatar={
                      process.env.BACKEND +
                      `/api/users/${item.receiver.id}/avatar`
                    }
                  />
                </div>
              ),
          )}
        {me && (
          <p
            className="text-white/80 text-xs absolute -top-3 right-2 font-semibold cursor-pointer px-2 py-1
          rounded-lg bg-white/10"
            onClick={() => {
              setShowBlocked((prev) => !prev);
            }}
          >
            {showBlocked ? 'friends' : 'blocked users'}
          </p>
        )}
      </div>
    </Card>
  );
};

export default Friends;
