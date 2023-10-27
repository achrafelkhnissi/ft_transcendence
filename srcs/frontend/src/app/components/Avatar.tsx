"use client";

import Image from "next/image";
import Link from "next/link";
import getCurrentUser from "../services/getCurrentUser";
import axios from "axios";
import { json } from "stream/consumers";

const ProfileImage = async () => {
  
  const data = await getCurrentUser();
  return <div></div>;
};
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
      <ProfileImage />
      <Link href={"/user-profile"}>
        <Image
          src="/images/fathjami.jpeg"
          alt="user"
          width={40}
          height={40}
          className="rounded-lg"
        />
      </Link>
    </div>
  );
};

export default Avatar;
