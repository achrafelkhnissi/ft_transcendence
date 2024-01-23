import React from "react";
import { Conversation } from "../data";
import Info from "./Info";

interface ChannelsHeaderProps {
    channel : Conversation,
}

const ChannelsHeader : React.FC<ChannelsHeaderProps> = ({
    channel
}) => {
    return (  
        <div 
        className="absolute w-full h-16 top-0  rounded-t-[3rem] border-b-4 border-b-[#4b4b79c6]
        shadow-[0_6px_7px_0_rgba(0,0,0,0.25)]
        flex justify-between p-6
        bg-[#25244E]">
        <div className="p-2 flex gap-2 self-center">
            <img src={channel.image} alt="" width={100} height={100}
            className="w-10 h-10 rounded-full self-center"/>
            <div className="flex flex-col self-center">
                <h6 className="font-semibold text-sm ">
                    {channel.name}
                </h6>
                <p className="font-light text-xs text-white/30 mt-1">
                    {channel.participants.length} members
                </p>
            </div>
        </div> 
        <div className="self-center">
           <Info/>
        </div>
    </div>
    )
}

export default ChannelsHeader;