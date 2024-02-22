'use client';

import { Conversation } from '@/components/messages/data';
import getConversations from '@/services/getConversations';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
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
    const newSocket = io(`${process.env.BACKEND}`, {
      withCredentials: true,
    }); // Replace with your server URL

    // TODO: Check for a better way to handle unauthorized socket and/or unauthorized access to any page
    newSocket.on('unauthorized', (error) => {
      console.log('unauthorized: ', error);

      newSocket.disconnect();

      // window.location.href = '/';
    });

    newSocket.on('connect', async () => {
      console.log({
        message: 'Connected to socket server',
        socketId: newSocket.id,
      });
    });

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
