import { useState, useEffect, useRef } from "react";
import BlockUser from "../svgAssets/BlockUser";
import Emoji from "../svgAssets/Emoji";
import GameInvitation from "../svgAssets/GameInvitation";
import SendMessage from "../svgAssets/SendMessage";
import MessageContainer from "./MessageContainer";
import { UserStatuses, ConversationsMap, User, Message } from "./data";
import Image from "next/image";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface ViewConversationsProps{
    conversationId: number,
    conversationsMap : ConversationsMap,
    orderedConversations: number[],
    statuses: UserStatuses,
    currentUser: string,
    addMessageToConversation: Function,
}

const ViewConversations : React.FC<ViewConversationsProps>= (
    {   conversationId, 
        conversationsMap, 
        orderedConversations, 
        statuses,
        currentUser,
        addMessageToConversation,
    }) =>{
        const [newMessage, setNewMessage] = useState<string>("");    

        const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false); 

        const handleEmojiSelect = (emojiObject: EmojiClickData, event: MouseEvent) => {
            setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
            setShowEmojiPicker(false);
        };
    
        const toggleEmojiPicker = () => {
            setShowEmojiPicker(!showEmojiPicker);
        };
    
        const chatContainerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }, [conversationsMap[conversationId]?.messages]);
      
        let sender: User, receiver: User =  {
            username: "",
            avatar: "",
            status: ""
        };

        if (conversationId >= 0) {
            const [firstParticipant, secondParticipant] = conversationsMap[conversationId].participants;

            sender = firstParticipant.username === currentUser ? firstParticipant : secondParticipant;
            receiver = firstParticipant.username === currentUser ? secondParticipant : firstParticipant;
        }

        const handleSend = () => {
            addMessageToConversation({
                content: newMessage,
                sender: sender,
                receiver: receiver,
                isRead: false,
                conversationId: conversationId,
                createdAt: new Date().toISOString(),
            })
            setNewMessage("");
        }
        
    return (
        <div
        className="w-4/6 bg-[#25244E] rounded-[3rem] max-[900px]:w-full
        shadow-[0_10px_20px_15px_rgba(0,0,0,0.2)] relative text-white">
            {/* Header */}
            {conversationId >= 0 && 
            <>
            <div 
                className="absolute w-full h-16 top-0 z-10 rounded-t-[3rem] border-b-4 border-b-[#4b4b79c6]
                shadow-[0_6px_7px_0_rgba(0,0,0,0.25)]
                flex justify-between p-6
                bg-[#25244E]">
                <div className="p-2 flex gap-2 self-center">
                    <img src={`http://localhost:3000/api/users/${receiver.username}/avatar`} alt="receiver" width={100} height={100}
                    className="w-10 h-10 rounded-full self-center"/>
                    <div className="flex flex-col self-center">
                        <h6 className="font-semibold text-sm ">
                            {receiver.username}
                        </h6>
                        <p className="font-light text-xs text-white/30 ">
                            {receiver.status.toLocaleLowerCase()}
                        </p>
                    </div>
                </div> 
                <div className="self-center flex gap-4 justify-center">
                    <div 
                        className="self-center hover:cursor-pointer
                        drop-shadow-[0_4px_8px_rgba(255,255,255,0.21)]">
                        <GameInvitation color={"#59598E"} width={"29px"} height={"29px"} />
                    </div>
                    <div className="w-[2px] h-[30px] bg-[#6C61A480]"></div>
                    <div 
                        className="self-center hover:cursor-pointer 
                        ">
                        <BlockUser color={"#59598E"} width={"29px"} height={"29px"} />
                    </div>
                </div>
            </div>
            {/* Messages */}
            <div className="w-full h-full overflow-hidden py-6 " >
                <div className="flex flex-col gap-2 h-5/6 my-auto mt-12 overflow-y-scroll px-6 py-4 "
                    ref={chatContainerRef}
                    >
                    {conversationsMap[conversationId].messages.map((message, index) => {
                    return (
                        <MessageContainer 
                        isCurrentUser={currentUser === message.sender.username} 
                        content={message.content} 
                        date={message.createdAt}
                        key={index}/>
                        )
                    })}
                </div>
            </div>
            {/* Input */}
            <div className="absolute bottom-3 w-11/12 h-14 rounded-3xl left-1/2 transform -translate-x-1/2
                            bg-[#59598E4A] flex text-sm">
                <div className="self-center pl-[1.3rem] hover:cursor-pointer
                drop-shadow-[0_3px_8px_rgba(255,255,255,0.15)] relative"
                onClick={toggleEmojiPicker}>
                    <Emoji color={"#20204A"} width={"29px"} height={"29px"}/>
                    <div className="absolute bottom-0 left-12">
                        {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiSelect} />}
                    </div>
                </div>
                <div className="w-full h-full flex py-2">
                    <textarea
                        name="message"
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-transparent w-full h-full outline-none px-6
                                placeholder:text-white/20 palceholder:text-sm resize-none pt-[0.7rem] overflow-y-auto"
                        placeholder="Type a message here..."/>
                </div>
                <div className="self-center pr-[1.3rem] hover:cursor-pointer
                drop-shadow-[0_3px_8px_rgba(255,255,255,0.15)]"
                    onClick={() => {
                       handleSend();
                    }}>
                    <SendMessage color={"#20204A"} width={"29px"} height={"29px"} />
                </div>
            </div>
            </>
            }
            {/* <p>{conversationId}</p> */}
    </div>
    )
}

export default ViewConversations;