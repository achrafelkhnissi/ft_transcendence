import { RiH6 } from "react-icons/ri";
import { Message, UserStatuses, Conversation, ConversationsMap, User } from "./data";
import Image from "next/image";
import formatChatTimestamp from "./tools/formatTime";
import { useState } from "react";

interface MessagesPreviewProps{
    conversationsMap : ConversationsMap,
    orderedConversations: number[],
    statuses: UserStatuses,
    selectedConversation: number,
    updateSelectedConversation: Function,
    markLastMessageAsRead: Function,
    currentUser: string,
}

const MessagesPreview: React.FC<MessagesPreviewProps> = 
({  conversationsMap,
    orderedConversations, 
    selectedConversation,
    updateSelectedConversation ,
    markLastMessageAsRead,
    currentUser,
    statuses}) => {
        
    const handleClick = (id: number) =>{
        updateSelectedConversation(id)
        markLastMessageAsRead(id);

    }

    return (<div className="flex flex-col w-full  text-white overflow-y-auto justify-center scroll-smooth px-2">
        {orderedConversations.map((id) => {
            if (conversationsMap[id].type === "DM"){
                const lastMessage = conversationsMap[id].messages[conversationsMap[id].messages.length - 1];
                const friend: User = conversationsMap[id].participants[0].username === currentUser? 
                                    conversationsMap[id].participants[1] : conversationsMap[id].participants[0];

                return (
                <div className={`flex justify-center  gap-2 h-[5.55rem] px-1 py-3 border-b-[3px] border-b-[#59598ec6] relative hover:cursor-pointer
                                hover:bg-white/[0.04] hover:shadow-[0_4px_11px_2px_rgba(0,0,0,0.35)]
                                ${selectedConversation == id && "bg-white/[0.04] shadow-[0_4px_11px_2px_rgba(0,0,0,0.35)]"}`}
                                onClick={() => handleClick(id)}
                                key={id}
                                >
                    <div className="self-center ">
                        <img src={`http://localhost:3000/api/users/${friend.username}/avatar`} alt="" width={100} height={100} 
                        className="w-12 h-12 rounded-full "/>
                    </div>
                    <div className="flex flex-col self-center w-4/6 gap-[0.1rem] justify-start">
                        <h6 className="font-normal text-sm">
                            {friend.username}
                        </h6>
                        <p className="text-white/70 text-xs font-light break-words">
                            {lastMessage?.content.slice(0, 80)}
                        </p>
                    </div>
                        <p className="text-[0.6rem] font-light text-white/60 mt-1">
                            {lastMessage ? formatChatTimestamp(lastMessage.createdAt): ""}
                        </p>
                {
                    (lastMessage && !lastMessage.isRead && lastMessage.sender.username === friend.username) && 
                    <div className="absolute w-[0.45rem] h-[0.45rem] rounded-full bg-[#6257FE] -left-2 z-10 top-1/2"></div>
               }
            </div>)
            }
        })}
    </div>)
}

export default MessagesPreview;