// import "./globals.css";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '../../components/layout/sidebar/Sidebar';
import Header from '../../components/layout/header/Header';
import { SocketProvider } from '@/contexts/socketContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PongTime',
  description: 'PongTime ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    </SocketProvider>
  );
}
