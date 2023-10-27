import { FaCrown } from "react-icons/fa";
import Image from "next/image";
import { IoTerminalSharp } from "react-icons/io5";

interface User {
  username: string;
  avatar: string;
  matchs: number;
  win: number;
  level: number;
  loss: number;
}

const arr: User[] = [
  {
    username: "ael-khni",
    avatar: "/images/ael-khni.jpeg",
    matchs: 15,
    level: 10,
    loss: 1,
    win: 5,
  },
  {
    username: "ael-khni",
    avatar: "/images/ael-khni.jpeg",
    matchs: 15,
    level: 10,
    loss: 1,
    win: 5,
  },
  {
    username: "ael-khni",
    avatar: "/images/ael-khni.jpeg",
    matchs: 15,
    loss: 1,
    win: 5,
    level: 10,
  },
  {
    username: "ael-khni",
    avatar: "/images/ael-khni.jpeg",
    matchs: 15,
    level: 5,
    loss: 1,
    win: 5,
  },
  {
    username: "ael-khni",
    avatar: "/images/ael-khni.jpeg",
    matchs: 15,
    loss: 1,
    win: 5,
    level: 10,
  },
  {
    username: "ael-khni",
    avatar: "/images/ael-khni.jpeg",
    matchs: 15,
    level: 5,
    loss: 1,
    win: 5,
  },
  {
    username: "ael-khni",
    avatar: "/images/ael-khni.jpeg",
    matchs: 15,
    level: 5,
    loss: 1,
    win: 5,
  },
  {
    username: "ael-khni",
    avatar: "/images/ael-khni.jpeg",
    matchs: 15,
    loss: 1,
    win: 5,
    level: 10,
  },
  {
    username: "ael-khni",
    avatar: "/images/ael-khni.jpeg",
    matchs: 15,
    level: 5,
    loss: 1,
    win: 5,
  },
];

const TopPlayers = () => {
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
              {arr.map((item, index) => {
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
                    <td className=" px-2 py-[0.6rem] text-white/30 text-center">
                      #{index + 1}
                    </td>
                    <td className="flex h-full justify-center gap-2 px-0 py-[0.6rem]">
                      <Image
                        src={item.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 
                                        self-center
                                        rounded-full"
                      />
                      <p className="self-center px-2 py-[0.6rem]">
                        {item.username}
                      </p>
                    </td>
                    <td className=" text-center pr-4 py-[0.6rem]">
                      {item.matchs}
                    </td>
                    <td className=" text-center pr-4 py-[0.6rem]">
                      {item.win}
                    </td>
                    <td className=" text-center pr-4 py-[0.6rem]">
                      {item.loss}
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
