/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import MessagesPreview from './dm/MessagesPreview';
import { UserStatuses, ConversationsMap, User, Conversation } from './data';
import getConversations from '@/services/getConversations';
import ChannelsPreview from './channels/ChannelsPreview';
import { IoMdAdd } from 'react-icons/io';

interface PreviewProps {
  conversationsMap: ConversationsMap;
  orderedConversations: number[];
  statuses: UserStatuses;
  selectedConversation: number;
  updateSelectedConversation: Function;
  markLastMessageAsRead: Function;
  currentUser: User | undefined;
  createBtn: boolean;
  setCreateBtn: Function;
  showConversation: boolean;
  updateShowConversation: Function;
}

interface ChannelesNamesMap {
  [key: string]: Conversation;
}

const Preview: React.FC<PreviewProps> = ({
  conversationsMap,
  orderedConversations,
  statuses,
  selectedConversation,
  updateSelectedConversation,
  currentUser,
  markLastMessageAsRead,
  createBtn,
  setCreateBtn,
  showConversation,
  updateShowConversation,
}) => {
  const [active, setActive] = useState<'messages' | 'channels'>('messages');
  const [searchInput, setSearchInput] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Conversation[]>([]);
  const [channelsNamesMap, setChannelsNamesMap] = useState<ChannelesNamesMap>(
    {},
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    if (e.target.value.length > 0) {
      const results = orderedConversations
        .map((id) => conversationsMap[id])
        .filter((conversation) => {
          if (conversation.type != 'DM') {
            return conversation.name
              .toLowerCase()
              .includes(e.target.value.toLowerCase());
          } else {
            const channelName =
              conversation.participants[0].id == currentUser?.id
                ? conversation.participants[1].username
                : conversation.participants[0].username;
            return channelName
              .toLowerCase()
              .includes(e.target.value.toLowerCase());
          }
        });

      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  return (
    <div
      className={`relative md:w-2/5  bg-[#25244E] rounded-[3rem] w-full h-full 
            shadow-[0_20px_40px_15px_rgba(0,0,0,0.2)] p-2 overflow-hidden
            ${showConversation && ' hidden md:block'} `}
    >
      <div className="w-full flex flex-col justify-center pt-2 gap-2">
        {/* switch */}
        <div
          className="
                                max-w-[350px] h-14 bg-[#101038] m-auto rounded-[1.2rem] px-2 w-full
                                shadow-[inset_0_4px_11px_0px_rgba(0,0,0,0.38)]
                                flex justify-around
                                text-[#453e76] font-bold text-sm sm:text-base
                                "
        >
          <div
            className={`self-center w-1/2
                        ${active === 'messages' && 'border-2 border-white/40 text-white bg-[#363366]'} 
                         rounded-xl py-2 drop-shadow-2xl text-sm sm:text-base
                        hover:cursor-pointer text-center
                        `}
            onClick={() => setActive('messages')}
          >
            Messages
          </div>
          <div
            className={`self-center w-1/2
                        ${active === 'channels' && 'border-2 border-white/40 text-white bg-[#363366]'} 
                        text-center rounded-xl py-2 drop-shadow-2xl
                        hover:cursor-pointer
                        `}
            onClick={() => setActive('channels')}
          >
            Channels
          </div>
        </div>
        {/* search bar */}
        <div className="max-w-[350px] m-auto w-full relative">
          <div
            className="w-full h-[2.6rem]  bg-[#101038] rounded-2xl 
                                shadow-[inset_0_4px_11px_0px_rgba(0,0,0,0.36)]
                                p-2
                                flex gap-1 "
          >
            <div className="self-center">
              <CiSearch
                style={{
                  color: '#453e76',
                  width: '1.8rem',
                  height: '1.8rem',
                }}
              />
            </div>
            <input
              type="text"
              className=" bg-transparent h-full w-full placeholder:text-[#453e76] placeholder:text-sm 
                                            outline-none text-[#524a89] text-sm font-light cursor-pointer
                                            "
              placeholder="Search"
              onChange={handleInputChange}
              value={searchInput}
              onClick={() => setShowResult((prev) => !prev)}
            />
            {showResult && (
              <div
                className="absolute w-full max-h-[200px] min-h-10 -bottom-11 left-1/2 transform -translate-x-1/2
            rounded-lg  bg-white/10
            flex flex-col gap-1 overflow-y-auto p-2 z-10  shadow-lg"
              >
                {searchResults.length > 0 &&
                  searchResults.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="px-2 py-1 w-full text-white/80 bg-[#28285a]/80 rounded-lg
                hover:bg-[#28285a]/70 hover:text-white cursor-pointer"
                      onClick={() => {
                        updateSelectedConversation(conversation.id);
                        setActive(
                          conversation.type === 'DM' ? 'messages' : 'channels',
                        );
                      }}
                    >
                      <div className="flex ">
                        <img
                          src={
                            conversation.type != 'DM'
                              ? process.env.BACKEND +
                                `/api/users/chat/${conversation?.id}/avatar`
                              : conversation.participants[1]?.id ==
                                  currentUser?.id
                                ? process.env.BACKEND +
                                  `/api/users/${conversation.participants[0]?.id}/avatar`
                                : process.env.BACKEND +
                                  `/api/users/${conversation.participants[1]?.id}/avatar`
                          }
                          alt=""
                          className="w-8 h-8 rounded-full inline-block mr-2 object-fill"
                        />
                        <p className="self-center text-sm">
                          {conversation.name}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {active === 'messages' && (
        <div className="h-[81%] overflow-y-auto scroll-smooth pb-2 mt-1 p-2">
          <MessagesPreview
            conversationsMap={conversationsMap}
            orderedConversations={orderedConversations}
            statuses={statuses}
            selectedConversation={selectedConversation}
            updateSelectedConversation={updateSelectedConversation}
            markLastMessageAsRead={markLastMessageAsRead}
            currentUser={currentUser}
            updateShowConversation={updateShowConversation}
          />
        </div>
      )}
      {active === 'channels' && (
        <div className="h-[81%] overflow-y-auto scroll-smooth pb-2 mt-1 p-2">
          <ChannelsPreview
            conversationsMap={conversationsMap}
            orderedConversations={orderedConversations}
            statuses={statuses}
            selectedConversation={selectedConversation}
            updateSelectedConversation={updateSelectedConversation}
            markLastMessageAsRead={markLastMessageAsRead}
            currentUser={currentUser}
            updateShowConversation={updateShowConversation}
          />
        </div>
      )}
      {active === 'channels' && (
        <div
          className="absolute bottom-6 right-5  rounded-full w-10 h-10 bg-blue-400
                drop-shadow-[0_4px_7px_rgba(255,255,255,0.25)]
                flex justify-center "
          onClick={() => setCreateBtn(true)}
        >
          <IoMdAdd
            className=" w-8 h-8 text-white/50 self-center
                cursor-pointer rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default Preview;
