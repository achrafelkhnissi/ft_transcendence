'use client'

import Preview from "@/components/messages/Preview";
import { useState, useEffect } from "react";
import ViewConversations from "@/components/messages/ViewConversations";
import { Message, UserStatuses, Conversation, ConversationsMap} from "../../../components/messages/data"
import getConversations from "@/services/getConversations";
import getCurrentUser from "@/services/getCurrentUser";

const Home = () => {
    const [userStatuses, setUserStatuses] = useState<UserStatuses>({});
    const [conversationOrder, setConversationOrder] = useState<number[]>([]);
    const [conversations, setConversations] = useState<ConversationsMap>({});
    const [selectedConversationId, setSelectedConversationId] = useState<number>(-1);
    const [currentUser, setCurrentUser] = useState<string>("");

    const initializeConversations = (initialConversations: Conversation[]) => {
    const sortedConversations = initialConversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
    const initialOrder = sortedConversations.map(convo => convo.id);
    const initialConversationsMap = initialConversations.reduce<ConversationsMap>((acc, convo) => {
        acc[convo.id] = convo;
        return acc;
      }, {});
      
      
        setConversationOrder(initialOrder);
        setConversations(initialConversationsMap);
    };
      
    const markLastMessageAsRead = (conversationId: number) => {
        setConversations(prevConversations => {
          const updatedConversations = { ...prevConversations };
          const conversation = updatedConversations[conversationId];
      
          if (conversation && conversation.messages.length > 0) {
            const lastMessageIndex = conversation.messages.length - 1;
            conversation.messages[lastMessageIndex] = {
              ...conversation.messages[lastMessageIndex],
              isRead: true
            };
          }
      
          return updatedConversations;
        });
      };
      
    const updateUserStatus = (userId: string, status: string) => {
        setUserStatuses(prevStatuses => ({
          ...prevStatuses,
          [userId]: status
        }));
      };
      
    useEffect(() => {
        getConversations().then(res => {
            initializeConversations(res);
        })
        getCurrentUser().then(res => {
            setCurrentUser(res.username);
        })
    }, [])
    return (
    <div className=" flex gap-6 w-full h-screen max-[900px]:flex-col px-6 py-4  ">
       <Preview
            conversationsMap={conversations}
            orderedConversations={conversationOrder}
            statuses={userStatuses}
            selectedConversation={selectedConversationId}
            updateSelectedConversation={setSelectedConversationId}
            markLastMessageAsRead={markLastMessageAsRead}/>
       <ViewConversations
            conversationId={selectedConversationId}
            conversationsMap={conversations}
            statuses={userStatuses}
            orderedConversations={conversationOrder}
            currentUser={currentUser}
            /> 
    </div>)
}

export default Home;