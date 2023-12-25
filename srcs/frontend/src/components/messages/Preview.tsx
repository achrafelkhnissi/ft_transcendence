'use client'
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import MessagesPreview from "./MessagesPreview";
import { Message, UserStatuses, Conversation, ConversationsMap } from "./data";
import getConversations from "@/services/getConversations";


const Preview = () => {

    const [active, setActive] = useState<"messages" | "channels">("messages");
    const [userStatuses, setUserStatuses] = useState<UserStatuses>({});
    const [conversationOrder, setConversationOrder] = useState<number[]>([]);
    const [conversations, setConversations] = useState<ConversationsMap>({});
    const [selectedConversationId, setSelectedConversationId] = useState<number>(-1);

    const initializeConversations = (initialConversations: Conversation[]) => {
    const sortedConversations = initialConversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
    const initialOrder = sortedConversations.map(convo => convo.id);
    console.log(sortedConversations);
    const initialConversationsMap = initialConversations.reduce<ConversationsMap>((acc, convo) => {
        acc[convo.id] = convo;
        return acc;
      }, {});
      
      
        setConversationOrder(initialOrder);
        setConversations(initialConversationsMap);
    };
      
    const updateUserStatus = (userId: string, status: string) => {
        setUserStatuses(prevStatuses => ({
          ...prevStatuses,
          [userId]: status
        }));
      };
      
    useEffect(() => {
        getConversations().then(res => {
            console.log(res);
            initializeConversations(res);
        })
    }, [])
    return (
    <div 
            className="w-2/5  bg-[#25244E] rounded-[3rem] max-[900px]:w-full 
            shadow-[0_20px_40px_15px_rgba(0,0,0,0.2)] p-2 overflow-hidden" >
                <div className="w-full flex flex-col justify-center pt-2 gap-2">
                    {/* switch */}
                    <div className="
                                w-[350px] h-14 bg-[#101038] m-auto rounded-[1.2rem] px-2
                                shadow-[inset_0_4px_11px_0px_rgba(0,0,0,0.38)]
                                flex justify-around
                                text-[#453e76] font-bold
                                ">
                        <div className={`self-center
                        ${active === "messages" && "border-2 border-white/40 text-white bg-[#363366]"} 
                        px-[2.7rem] rounded-xl py-2 drop-shadow-2xl
                        hover:cursor-pointer
                        `}
                        onClick={() => setActive('messages')}
                        > 
                            Messages 
                        </div>
                        <div className={`self-center
                        ${active === "channels" && "border-2 border-white/40 text-white bg-[#363366]"} 
                        px-[2.7rem] rounded-xl py-2 drop-shadow-2xl
                        hover:cursor-pointer
                        `}
                        onClick={() => setActive('channels')}
                        > 
                            Channels 
                        </div>
                    </div>
                    {/* search bar */}
                    <div className="w-[350px] m-auto">
                        <form   action="" 
                                className="w-full h-[2.6rem]  bg-[#101038] rounded-2xl 
                                shadow-[inset_0_4px_11px_0px_rgba(0,0,0,0.36)]
                                p-2
                                flex gap-1 ">
                            <div className="self-center"> 
                                <CiSearch
                                    style={{
                                    color: "#453e76",
                                    width: "1.8rem",
                                    height: "1.8rem",
                                    }}
                                />
                            </div>
                            <input
                                type="text"
                                className=" bg-transparent h-full w-full placeholder:text-[#453e76] placeholder:text-sm 
                                            outline-none text-[#524a89] text-sm font-light "
                                placeholder="Search"
                            />
                        </form>
                    </div>
                </div>
                {active === "messages" && 
                    <div className="h-[81%] overflow-y-auto scroll-smooth pb-2 mt-1 p-2">
                        <MessagesPreview 
                            conversationsMap={conversations}
                            orderedConversations={conversationOrder}
                            statuses={userStatuses}
                         />
                    </div>
                }
                
        </div>)
}

export default Preview