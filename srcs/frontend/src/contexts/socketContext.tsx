'use client'

import { Conversation } from '@/components/messages/data';
import getConversations from '@/services/getConversations';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    
    const newSocket = io('http://localhost:3000'); // Replace with your server URL
    
    
    newSocket.on('connect', async () => {
      console.log({
        message: 'Connected to socket server',
        socketId: newSocket.id,
      });
    })
    
    getConversations().then((res) => {
      // console.log(res);
      setConversations(res)});
    
    // join the rooms
    // console.log(conversations);
    conversations.map((conversation) => {
      socket?.emit("joinRoom", conversation.name);
      console.log("joining room "+ conversation.name)
    })
    
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
