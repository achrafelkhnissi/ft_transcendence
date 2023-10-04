import SearchInput from "./SearchInput";
import Notifications from "./Notifications";
import Avatar from "./Avatar";

const Header = () => {
  return (
    <div className="flex justify-between pt-4 px-4">
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
