// import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/app/components/layout/sidebar/Sidebar";
import Header from "@/app/components/layout/header/Header";

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
      <body className={inter.className}>
        <div className="flex flex-row w-full h-full">
      <Sidebar />
      <div className="w-full h-full">
        <Header />
        {children}
      </div>
      </div>
        </body>
    </html>
  );
}
