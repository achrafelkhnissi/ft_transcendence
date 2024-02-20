// import "./globals.css";
"use client"
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '../../components/layout/sidebar/Sidebar';
import Header from '../../components/layout/header/Header';
import { SocketProvider, useSocket } from '@/contexts/socketContext';
import { useEffect, useState } from 'react';
import InvitePopup from '@/components/game/InvitePopUp';
import { User } from '@/components/userProfile/types';
import getCurrentUser from '@/services/getCurrentUser';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'PongTime',
//   description: 'PongTime ',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket } = useSocket();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(true);
  const [currentUser, setCurrentUser] = useState<User>({
    id: null,
    username: '',
    url: '',
    stats: {
      exp: 0,
      level: 0,
      wins: 0,
      losses: 0,
    },
    me: false,
    games: [],
    isFriend: false,
    friends: [],
  });

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const acceptInvitation = () =>{
    closePopup();
    router.push('/play');
  };

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res){
        console.log(res);
        setCurrentUser(res);
      }
    });
    socket?.on('invite', () => {
      openPopup();
    });

    return () => {
      socket?.off('invite', openPopup);
    };
  }, [socket]);

  return (
    <SocketProvider>
      <div className="flex flex-row w-full h-full overflow-hidden">
        <div>
          <Sidebar />
        </div>
        <div className="w-full h-full overflow-y-auto">
          <Header />
          <div className="max-w-[1500px] w-full mx-auto">{children}</div>
        </div>
      </div>
      {showPopup && (
        <InvitePopup accept={acceptInvitation} refuse={closePopup} >
          <p>
            Hey {currentUser.username}, [Challenger] has challenged you to a thrilling game
            of ping pong. Are you up for the challenge? Accept and let the games
            begin!
          </p>
        </InvitePopup>
      )}
    </SocketProvider>
  );
}
