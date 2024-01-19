"use client";

import FriendAvatar from "../FriendAvatar";
import Card from "./Card";
import { MdEmojiPeople } from "react-icons/md";
import { FriendsProps } from "./types";

interface FriendsComponentProps {
  friends : FriendsProps[],
}

const Friends: React.FC<FriendsComponentProps> = ({friends}) => {

  return (
    <Card
      header="friends"
      icon={<MdEmojiPeople className="text-[#6C61A4] w-6 h-6" />}
    >
      <div className="w-full flex gap-4 flex-wrap  justify-start py-2 max-h-[280px] pl-4 pr-[0.55rem]">
        {friends.map((item, index) => (
          <FriendAvatar key={index} name={item.username} avatar={`http://localhost:3000/api/users/${item.username}/avatar`} />
        ))}
      </div>
    </Card>
  );
};

export default Friends;
