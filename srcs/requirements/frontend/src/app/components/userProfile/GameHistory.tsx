import Image from "next/image";
import Card from "./Card";
import { RiChatHistoryFill } from "react-icons/ri"
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai"

interface User{
  username: string;
  avatar: string;
}

interface GameHistoryProps {
  oponenent: User;
  openenentScore: number;
  userScroe: number;
}

const arr: GameHistoryProps[] = [
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 3,
    userScroe: 2,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 2,
    userScroe: 3,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 1,
    userScroe: 4,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 0,
    userScroe: 5,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 3,
    userScroe: 2,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 2,
    userScroe: 3,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 1,
    userScroe: 4,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 0,
    userScroe: 5,
  },
  
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 3,
    userScroe: 2,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 2,
    userScroe: 3,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 1,
    userScroe: 4,
  },
  {
    oponenent: {
      username: "ael-khni",
      avatar: "/images/ael-khni.jpeg",
    },
    openenentScore: 0,
    userScroe: 5,
  },
  

]

const GameHistory = () => {
    return (
          <Card header="game history" icon={<RiChatHistoryFill className="text-[#6C61A4] w-5 h-5" />}>
            <div className="flex gap-1 flex-col p-4  h-full  max-h-[680px] w-full">
              {
                arr.map((item, index) => {
                  return (
                <div key={index} className={`
                 w-full h-16 rounded-full py-2
                 flex justify-around
                 
                  ${!(index % 2) && 'bg-[#1C1C43]'}`}>

                  <div className="flex gap-4 text-white text-sm">
                      <Image src={item.oponenent.avatar} alt="" width={40} height={40}
                            className='w-10 h-10 
                                      object-fit
                                      self-center
                                      rounded-full'/>
                      <p className="self-center">
                        {item.oponenent.username}
                      </p>
                  </div>
                  <div className="text-white self-center text-sm">
                    {item.userScroe} / {item.openenentScore}
                  </div>
                  <div className={`self-center text-sm font-semibold center 
                                ${item.openenentScore > item.userScroe ? "text-red-400" : " text-green-400 "}`}>
                    {item.openenentScore > item.userScroe? <AiFillCloseCircle/> : <AiFillCheckCircle/>}
                  </div>
              </div>)
                })
              }
            </div>
          </Card>
        )
}

export default GameHistory;