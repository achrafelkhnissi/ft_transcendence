import SearchInput from "./SearchInput";
import Notifications from "./Notifications";
import Avatar from "./Avatar";

const Header = () => {
  return (
    <div className="flex justify-between p-4 bg-[#39396F] shadow-xl  shadow-gray-900/20">
      <div className="text-white">LOGO</div>
      <SearchInput />
      <div className="flex gap-4">
        <Notifications />
        <Avatar />
      </div>
    </div>
  );
};

export default Header;
