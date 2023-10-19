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
];

const TopPlayers = () => {
  return (
    <div className="py-4 w-full">
      <div className="flex gap-1 pl-4 pb-6">
        <FaCrown className="text-[#E89B05]" />
        <p className="text-white font-semibold"> Top Players Today </p>
      </div>
      <div className="w-full h-[26rem] bg-[#20204A] rounded-[2rem] py-6 px-2 ">
        <table className="w-full h-full ">
          <thead className="">
            <tr className="">
              <th>Rank Username</th>
              <th> Matchs</th>
              <th> Win</th>
              <th>Loss</th>
            </tr>
          </thead>
          <tbody className="w-full">
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
                  <td className="flex gap-2 ">
                    <div className="self-center pr-8 text-white/20">
                      {" "}
                      #{index + 1}
                    </div>
                    <Image
                      src={item.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 
                                        self-center
                                        rounded-full"
                    />
                    <p className="self-center">{item.username}</p>
                  </td>
                  <td>{item.matchs}</td>
                  <td>{item.win}</td>
                  <td>{item.loss}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPlayers;
