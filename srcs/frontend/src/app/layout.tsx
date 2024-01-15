import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from 'next/head'
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PongTime",
  description: "PongTime ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <body className={`${inter.className} `}>
      <Toaster position="top-center" />
        {children}
        </body>
    </html>
  );
}
