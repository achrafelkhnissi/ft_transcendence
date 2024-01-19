'use client'

import Preview from "@/components/messages/Preview";
import { useState, useEffect } from "react";
import ViewConversations from "@/components/messages/ViewConversations";
import { Message, UserStatuses, Conversation, ConversationsMap} from "../../../../components/messages/data"
import getConversations from "@/services/getConversations";
import getCurrentUser from "@/services/getCurrentUser";
import { useSocket } from "@/contexts/socketContext";

const Home = ({ params }: { params: { id: number } }) => {
  const [userStatuses, setUserStatuses] = useState<UserStatuses>({});
  const [conversationOrder, setConversationOrder] = useState<number[]>([]);
  const [conversations, setConversations] = useState<ConversationsMap>({});
  const [selectedConversationId, setSelectedConversationId] = useState<number>(-1);
  const [currentUser, setCurrentUser] = useState<string>("");
  const { socket } = useSocket();

    const initializeConversations = (initialConversations: Conversation[]) => {
    const sortedConversations = initialConversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
    const initialOrder = sortedConversations.map(convo => convo.id);
    const initialConversationsMap = initialConversations.reduce<ConversationsMap>((acc, convo) => {
        acc[convo.id] = convo;
        return acc;
      }, {});
      
      
        setConversationOrder(initialOrder);
        setConversations(initialConversationsMap);
        if (params.id > 0){
          setSelectedConversationId(params.id);
        }
    };


// socket
  useEffect(() => {
    if (socket) {
      // Listen for the 'connect' event
      console.log(socket)
      socket.on('connect', () => {
        // console.log({
        //   message: 'Connected to socket server',
        //   socketId: socket.id,
        // });

        // // You can also log the socket ID
        // console.log('Socket ID:', socket.id);
      });

      socket.on('onMessage', (message: Message) => {
        console.log('New message:', message);
        // Handle the message
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('message');
      }
    };
  }, [socket]);

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
      
    const addMessageToConversation = (newMessage: Message) => {
      const conversationId = newMessage.conversationId;
      if (conversations[conversationId]){
        setConversations((prev) => ({
          ...prev,
          [conversationId]:{
            ...prev[conversationId],
            messages : [...prev[conversationId].messages, newMessage],
            updatedAt: new Date().toISOString(),
          }
        }))
        setConversationOrder(prevOrder => {
          return [conversationId, ...prevOrder.filter(id => id !== conversationId)];
        });
      } else {
        // Handle case where the conversation is new or not loaded
      }
    }

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
            markLastMessageAsRead={markLastMessageAsRead}
            currentUser={currentUser}/>
       <ViewConversations
            conversationId={selectedConversationId}
            conversationsMap={conversations}
            statuses={userStatuses}
            orderedConversations={conversationOrder}
            currentUser={currentUser}
            addMessageToConversation={addMessageToConversation}
            /> 
    </div>)
}

export default Home;