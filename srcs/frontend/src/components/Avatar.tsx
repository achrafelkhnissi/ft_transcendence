'use client'

import Link from "next/link";
import AvatarImage from "./AvatarImage";

const Avatar = () => {
  return (
    <div
      className={`h-[2rem] 
    w-[2rem] 
    bg-gray-400/60
     rounded-lg 
     flex 
     justify-center 
     items-center 
     outline 
     outline-2 
     outline-offset-[1.5px]
     outline-gray-400/60
     cursor-pointer`}
    >
      <Link href={"/user-profile/me"}>
      <AvatarImage/>
      </Link>
    </div>
  );
};

export default Avatar;
