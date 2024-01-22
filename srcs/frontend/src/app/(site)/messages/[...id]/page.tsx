'use client'

import Preview from "@/components/messages/Preview";
import { useState, useEffect } from "react";
import ViewConversations from "@/components/messages/ViewConversations";
import { Message, UserStatuses, Conversation, ConversationsMap} from "../../../../components/messages/data"
import getConversations from "@/services/getConversations";
import getCurrentUser from "@/services/getCurrentUser";
import { useSocket } from "@/contexts/socketContext";
import CreateChannel from "@/components/messages/channels/CreateChannel";

const Home = ({ params }: { params: { id: number } }) => {
  const [userStatuses, setUserStatuses] = useState<UserStatuses>({});
  const [conversationOrder, setConversationOrder] = useState<number[]>([]);
  const [conversations, setConversations] = useState<ConversationsMap>({});
  const [selectedConversationId, setSelectedConversationId] = useState<number>(-1);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [createChannel, setCreateChannel] = useState<boolean> (false);
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
      socket.on('connect', () => {
        console.log({
          message: 'from messages Connected to socket server',
          socketId: socket.id,
        });

        // // You can also log the socket ID
        // console.log('Socket ID:', socket.id);
      });

      socket.on('onMessage', (message: Message) => {
        // console.log('New message:', message);
        setConversations((prev) => ({
          ...prev,
          [message.conversationId]:{
            ...prev[message.conversationId],
            messages : [...prev[message.conversationId].messages, message],
            updatedAt: new Date().toISOString(),
          }
        }))
        console.log('houna');
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('onMessage');
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
  
      const conversationId = Number(newMessage.conversationId);
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
          return [conversationId, ...prevOrder.filter(id => id != conversationId)];
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
          console.log('res', res);
            initializeConversations(res);
        })
        getCurrentUser().then(res => {
            setCurrentUser(res.username);
        })
    }, [])
    return (
    <div className={` flex gap-6 w-full h-screen max-[900px]:flex-col px-6 py-4  relative
    `}>
       <Preview
            conversationsMap={conversations}
            orderedConversations={conversationOrder}
            statuses={userStatuses}
            selectedConversation={selectedConversationId}
            updateSelectedConversation={setSelectedConversationId}
            markLastMessageAsRead={markLastMessageAsRead}
            createBtn={createChannel}
            setCreateBtn={setCreateChannel}
            currentUser={currentUser}/>
       <ViewConversations
            conversationId={selectedConversationId}
            conversationsMap={conversations}
            statuses={userStatuses}
            orderedConversations={conversationOrder}
            currentUser={currentUser}
            addMessageToConversation={addMessageToConversation}
            /> 
       {
        createChannel && 
       <div className={`absolute w-full h-full flex justify-center
        top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        ${createChannel && "blur-container"} `}
        onClick={() => setCreateChannel(false)}
        >
            <div className="w-2/5 h-4/5 border-2 self-center bg-white/70 "
            onClick={(e) => e.stopPropagation()}>
              <CreateChannel/>
            </div>
        </div>
       } 
    </div>)
}

export default Home;