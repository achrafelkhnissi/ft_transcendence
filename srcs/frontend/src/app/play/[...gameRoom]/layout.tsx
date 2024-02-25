'use client'
import InvitePopup from '@/components/game/InvitePopUp';
import { SocketProvider } from '@/contexts/socketContext';
// import '../../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

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
  return (
    <SocketProvider>
      <div className="w-full h-full">{children}</div>
      <InvitePopup/>
      <ToastContainer/>
    </SocketProvider>
  );
}
