"use client";

import UserInfo from "../../../../components/userProfile/UserInfo";
import GameHistory from "../../../../components/userProfile/GameHistory";
import Achievements from "../../../../components/userProfile/Achievements";
import Friends from "../../../../components/userProfile/Friends";
import getCurrentUser from "@/services/getCurrentUser";
import { useState } from "react";
import { useEffect } from "react";
import getUser from "@/services/getUser";

interface User {
  id: string;
  username: string;
  avatar: string;
  experiencePoints: number;
  level: number;
}

const defaultInfos: User = {
  id: "",
  username: "",
  avatar: "",
  experiencePoints: 0,
  level: 0,
};

const Home = ({ params }: { params: { name: string } }) => {
  const abortController = new AbortController();
  const [user, setUser] = useState<User>(defaultInfos);

  useEffect(() => {
    if (params.name == "me"){
      getCurrentUser().then((res) => {
        const userData: User = res;
        setUser(userData);
      });
    }
    else {
      getUser(params.name).then((res) => {
        const userData: User = res;
        setUser(userData);
      });
    }

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
          <GameHistory />
        </div>
        <Friends />
        <Achievements />
      </div>
    </div>
  );
};

export default Home;
