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

  useEffect(() => {
    
    const newSocket = io('http://localhost:3000/chat', {
      withCredentials: true,
    }); // Replace with your server URL
    
    
    newSocket.on('connect', async () => {

      console.log({
        message: 'Connected to socket server',
        socketId: newSocket.id,
      });
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
