import { SocketProvider } from '@/contexts/socketContext';
import '../../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
    <html lang="en">
        
      <body className={`${inter.className} `}>{children}</body>
    </html>
      </SocketProvider>
  );
}
