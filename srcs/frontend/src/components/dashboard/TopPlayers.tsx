'use client'

import { FaCrown } from "react-icons/fa";
import Image from "next/image";
// import { IoTerminalSharp } from "react-icons/io5";
// import UserName from "../userProfile/UserName";
import getRankings from "@/services/getRankings";
import { useEffect, useState } from "react";

interface User {
  username: string;
  avatar: string;
  stats : {
      wins: number;
      level: number;
      losses: number;
  }
}

const TopPlayers = () => {

  const [ranking, setRanking] = useState<User[]>([]);

  useEffect(() => {
    getRankings().then(res => {
      const data: User[] = res;
      setRanking(data);
    })
  }, [])

  return (
    <div className="py-4 w-full">
      <div className="flex gap-1 pl-4 pb-6">
        <FaCrown className="text-[#E89B05]" />
        <p className="text-white font-semibold"> Top Players Today </p>
      </div>
      <div className="flex justify-center w-full ">
        <div className="h-[27rem] w-[70rem] max-[500px]:w-full relative overflow-y-auto bg-[#20204A] shadow-xl rounded-t-2xl rounded-b-lg">
          <table className=" text-white  bg-[#20204A] w-full ">
            <thead className=" top-0 sticky bg-[#20204A] shadow-md">
              <tr className=" text-[#6C61A4] ">
                <th className="pr-2 py-4">Rank</th>
                <th className="pr-2 py-4">Username</th>
                <th className="pr-4 py-4"> Matchs</th>
                <th className="pr-4 py-4"> Win</th>
                <th className="pr-4 py-4">Loss</th>
              </tr>
            </thead>
            <tbody className="w-full ">
              {ranking.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`
                    w-full h-16
                    rounded-full
                    text-white
                    ${!(index % 2) && "bg-[#1C1C43]"}
                    `}
                  >
                    <td className=" flex h-full gap-3 justify-center px-2 py-[0.6rem] text-white/30 text-center">
                      <p className="self-center">
                        #{index + 1}
                      </p>
                      <Image
                        src={item.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 
                                        self-center
                                        rounded-full"
                      />
                    </td>
                      <td className="px-2 py-[0.6rem] text-center">
                          {item.username}
                      </td>
                    <td className=" text-center pr-4 py-[0.6rem]">
                      {item.stats.wins + item.stats.losses}
                    </td>
                    <td className=" text-center pr-4 py-[0.6rem]">
                      {item.stats.wins}
                    </td>
                    <td className=" text-center pr-4 py-[0.6rem]">
                      {item.stats.losses}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopPlayers;
