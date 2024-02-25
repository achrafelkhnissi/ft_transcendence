/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Conversation } from '../data';
import InfoIcon from './InfoIcon';
import { IoIosArrowBack } from 'react-icons/io';

interface ChannelsHeaderProps {
  channel: Conversation;
  updateConversations: Function;
  showChannelInfo: boolean;
  setShowChannelInfo: Function;
}

const ChannelsHeader: React.FC<ChannelsHeaderProps> = ({
  channel,
  updateConversations,
  showChannelInfo,
  setShowChannelInfo,
}) => {
  return (
    <div
      className="absolute w-full h-16 top-0  rounded-t-[3rem] border-b-4 border-b-[#4b4b79c6]
        shadow-[0_6px_7px_0_rgba(0,0,0,0.25)]
        flex justify-between p-6
        bg-[#25244E]"
    >
      <div className="p-2 flex gap-2 self-center">
        <img
          src={process.env.BACKEND + `/api/users/chat/${channel.id}/avatar`}
          alt=""
          width={100}
          height={100}
          className="w-10 h-10 rounded-full self-center object-cover"
        />
        <div className="flex flex-col self-center">
          <h6 className="font-semibold text-sm ">{channel.name}</h6>
          <p className="font-light text-xs text-white/30 mt-1">
            {channel.participants.length 
            + channel.admins.length 
            + 1} members
          </p>
        </div>
      </div>
      <div className="self-center"
      onClick={() => setShowChannelInfo(true)}>
        <InfoIcon clicked={showChannelInfo} />
      </div>
      <IoIosArrowBack
        className="absolute left-2 text-[#6C61A4] w-6 h-6 bottom-4 cursor-pointer hover:drop-shadow-[0_0px_8px_rgba(255,255,255,0.9)]
      md:hidden"
        onClick={() => {
          updateConversations(false);
        }}
      />
    </div>
  );
};

export default ChannelsHeader;
