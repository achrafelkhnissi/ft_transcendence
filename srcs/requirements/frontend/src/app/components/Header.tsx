import SearchInput from "./SearchInput";
import Notifications from "./Notifications";
import Avatar from "./Avatar";
import Logo from "./Logo";

const Header = () => {
  return (
    <div className="flex justify-between px-3 py-[0.6rem] bg-[#39396F] shadow-xl  shadow-gray-900/20 items-center">
      <Logo />
      <SearchInput />
      <div className="flex gap-4">
        <Notifications />
        <Avatar />
      </div>
    </div>
  );
};

export default Header;
