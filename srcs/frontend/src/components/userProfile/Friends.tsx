"use client";

import FriendAvatar from "../FriendAvatar";
import Card from "./Card";
import { MdEmojiPeople } from "react-icons/md";
// import { useState, useEffect } from "react";
// import { User } from "@/app/(site)/profile/[...name]/page";
// import getFriendsList from "@/services/getFriendsList";
import { FriendsProps } from "@/app/(site)/profile/[...name]/page";

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
          <FriendAvatar key={index} name={item.username} avatar={item.avatar} />
        ))}
      </div>
    </Card>
  );
};

export default Friends;
