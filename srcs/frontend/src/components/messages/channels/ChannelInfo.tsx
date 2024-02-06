'use client';
import { useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { Conversation, User } from "../data";
import Member from "./Member";
import getUser from "@/services/getUser";

interface ChannelInfoProps {
    channel: Conversation;
    addMember: Function;
    addAdmin: Function;
    currentUser: string;
}

const newMemberError = {
    0: 'valid',
    1: 'user already exist!',
    2: 'invalid user!',
  }

const ChannelInfo: React.FC<ChannelInfoProps> = ({
    channel,
    addMember,
    addAdmin,
    currentUser,
}) => {
    const length = channel.participants.length + channel.admins.length + 1;
    const [newMember, setNewMember] = useState<string>('');
    const [memberError, setMemeberError] = useState<0 | 1| 2 >(0);

    const handleNewMemmber = () => {
        if (newMember != '' && newMember != currentUser){
          getUser(newMember).then((res) => {
            if (res){
              if (channel.participants.every((obj) => obj.id != res.id) 
                && channel.admins.every((obj) => obj != res.id) 
                && channel.owner.id != res.id){
                setMemeberError(0);
                addMember(channel.id, res);
              }
              else{
                  setMemeberError(1);
              }
            } else {
                setMemeberError(2);
            }
          })
          setNewMember('');
          setTimeout(() => {
            setMemeberError(0);
          }, 4000);
        }
      }

const handleLeaveChannel = () => {
    
}
    return (
        <div className="w-full h-full  rounded-lg bg-[#101038] shadow-2xl p-4 
                        flex flex-col gap-4">
            <h1 className="self-center md:text-[1.5rem] text-xl text-white/90 font-semibold"> 
                Channel Info 
            </h1>
            <div className="flex flex-col justify-center py-2 gap-2">
                <img
                src={process.env.BACKEND + `/api/users/chat/${channel.id}/avatar`}
                alt=""
                className="md:w-[8rem] md:h-[8rem] w-[6rem] h-[6rem] rounded-full self-center border-2 border-blue-500 object-cover"
                />
                <p className="self-center md:text-[1.2rem] text-sm">{channel.name}</p>
            </div>
            <div className="flex flex-col gap-2 text-sm md:text-[1rem] pb-2">
                <h3 className="">
                    {length} members
                </h3>
                {/* add member */}
                <div className="relative w-full h-10 mb-2">
                  <input
                  type="text"
                  id="new-member"
                  maxLength={13}
                  placeholder={"Add memeber"}
                  value={newMember}
                  onChange={(e) => {
                    setNewMember(e.target.value);
                  }}
                  className={`w-full h-full rounded-[0.7rem] border-2 border-blue-500/80 bg-white/5 outline-none px-4
                  text-white text-xs font-normal placeholder:opacity-40 placeholder:text-xs md:placeholder:text-sm`}
                  />
                <label
                  htmlFor="new-member"
                  className="cursor-pointer rounded-full w-[1.3rem] h-[1.3rem] bg-white flex justify-center
                              absolute right-2 bottom-[0.7rem] "
                              onClick={handleNewMemmber}
                >
                  <RiAddFill
                    className="text-blue-500 font-bold self-center w-8 h-8 -mb-[0.07rem]"
                    />
                  </label>
                  {
                    memberError > 0 && (
                      <p className='absolute text-red-600 text-[0.7rem] -bottom-4 left-2 pt-[0.2rem]'> 
                      {newMemberError[memberError]} 
                      </p>
                    )
                  }
                </div>
                <div className="flex gap-2 flex-col overflow-y-auto max-h-[500px] px-2">
                   <Member 
                    id={channel.owner.id} 
                    username={channel.owner.username} 
                    avatar={channel.owner.avatar} 
                    role={"Owner"} 
                    status={channel.owner.status} />
                    {channel.admins.map((admin, index) => {
                        return (
                            <div key={index} className="text-white/80">
                                <Member 
                                    id={admin.id} 
                                    username={admin.username} 
                                    avatar={admin.avatar} 
                                    role={"Admin"} 
                                    status={admin.status} />
                            </div>
                        );}
                    )}
                    {
                        channel.participants.map((participant, index) => {
                            return (
                                <div key={index} className="text-white/80">
                                    <Member 
                                        id={participant.id} 
                                        username={participant.username} 
                                        avatar={participant.avatar} 
                                        role={""} 
                                        status={participant.status} />
                                </div>
                                
                            );
                        })
                    }
                </div>
            </div>
            <div className="self-center flex">
                <button className="px-4 py-2 bg-red-800 rounded-lg text-white/80 cursor-pointer hover:bg-red-700"
                onClick={handleLeaveChannel}>
                    leave channel
                </button>
            </div>
        </div>
    )
}

export default ChannelInfo;