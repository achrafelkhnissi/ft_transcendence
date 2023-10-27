
import LgSearchInput from "./LgSearchInput";
import Notifications from "./Notifications";
import Avatar from "../../Avatar";


const Header = () => {
  return (
    <div className="flex justify-between  px-3 bg-[#39396F] shadow-xl shadow-gray-900/20 items-center h-[3.4rem] w-full gap-2">
      <div className=""></div>
      {/* {screenW < 530 ? <SmSearchInput /> : <LgSearchInput />} */}
        <LgSearchInput />
      <div className={`flex gap-4  ight-6 `}>
        <Notifications />
        <Avatar />
      </div>
    </div>
  );
};

export default Header;
