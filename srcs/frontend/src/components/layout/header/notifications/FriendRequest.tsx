import Image from "next/image";
import { NotificationsType } from "./Notifications";

const handleAccept = () => {

}

const handleCancel = () => {

}

const FriendRequest: React.FC<NotificationsType> = (notif) => {
  return (
    <div className="bordder text-black w-full h-20 text-sm px-2 font-normal bg-white/80 flex justify-between rounded-2xl gap-2">
      <Image alt="" src={""} width={20} height={20} className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-black self-center"/>
      <p className="text-center self-center ">flan wants to be you friend</p>
      <div className="flex flex-col justify-center gap-1 py-2 text-xs">
        <button
          className=" rounded-md py-1 px-[0.6rem] bg-[#4E4B8B] text-white"
          onClick={handleAccept}
        >
          accept
        </button>
        <button
          className="rounded-md py-1 px-[0.6rem] border border-[#4E4B8B] text-[#4E4B8B]"
          onClick={handleCancel}
        >
          decline
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
