"use client";

import LgSearchInput from "./LgSearchInput";
import Notifications from "./Notifications";
import Avatar from "../../Avatar";
import Logo from "../../logos/ PongTimeLogo";
import { useState, useEffect } from "react";
// import SmSearchInput from "./SmSearchinput";

const Header = () => {
  // const [screenW, setScreenW] = useState(0); //TODO: fix this to be responsive

  // useEffect(() => {
  //   setScreenW(window.innerWidth);
  //   const handleWindowResize = () => {
  //     setScreenW(window.innerWidth);
  //   };

  //   window.addEventListener("resize", handleWindowResize);

  //   return () => {
  //     window.removeEventListener("resize", handleWindowResize);
  //   };
  // }, []);

  return (
    <div className="flex justify-between px-3 py-[0.6rem] bg-[#39396F] shadow-xl shadow-gray-900/20 items-center h-[4rem] w-full">
      <div className="w-40"></div>
      {/* {screenW < 530 ? <SmSearchInput /> : <LgSearchInput />} */}
        <LgSearchInput />
      <div className={`flex gap-4  right-6`}>
        <Notifications />
        <Avatar />
      </div>
    </div>
  );
};

export default Header;
