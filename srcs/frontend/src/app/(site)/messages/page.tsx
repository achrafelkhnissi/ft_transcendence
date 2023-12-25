'use client'

import Preview from "@/components/messages/Preview";
import { useState, useEffect } from "react";
import ViewConversations from "@/components/messages/ViewConversations";
import { Message, UserStatuses, Conversation, ConversationsMap} from "../../../components/messages/data"
import getConversations from "@/services/getConversations";

const Home = () => {
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
    <div className=" flex gap-6 w-full h-screen max-[900px]:flex-col px-6 py-4  ">
       <Preview
            conversationsMap={conversations}
            orderedConversations={conversationOrder}
            statuses={userStatuses}
            selectedConversation={selectedConversationId}
            updateSelectedConversation={setSelectedConversationId}/>
       <ViewConversations
            conversationId={selectedConversationId}
            conversationsMap={conversations}
            statuses={userStatuses}
            orderedConversations={conversationOrder}/> 
    </div>)
}

export default Home;