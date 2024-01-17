import Image from "next/image";
import { NotificationsType } from "./Notifications";
import acceptFriendRequest from "@/services/acceptFriendRequest";
import deleteNotification from "@/services/deleteNotification";
import declineFirendRequest from "@/services/declineFriendRequest";
import { useState } from "react";

const FriendRequest: React.FC<NotificationsType> = (notif) => {
  const [actionDone, setActionDone] = useState(false);

  const handleAccept = () => {
    acceptFriendRequest(notif.sender.username).then(() => {
      deleteNotification(notif.id);
    });
    setActionDone(true);
  };

  const handleDecline = () => {
    declineFirendRequest(notif.sender.username).then(() => {
      deleteNotification(notif.id);
    });
    setActionDone(true);
  };

  return (
    <div className="relative">
        <div className={`text-[0.8rem] text-center opacity-0 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 z-10
        transition-all ease-out duration-300 delay-200 ${actionDone && " opacity-100 "}`}>
          Friend request accepted successfully!
        </div>
      <div
        className={`bordder text-white/80 w-full h-20 text-[0.8rem] px-2 font-normal bg-[#3A386A]  flex justify-between rounded-2xl gap-2 transition-all ease-in duration-300
                    ${actionDone && " opacity-0 "}`}
      >
        <img
          alt=""
          src={`http://localhost:3000/api/users/${notif.sender.username}/avatar`}
          width={20}
          height={20}
          className="w-[2.5rem] h-[2.5rem] rounded-full  self-center"
        />
        <p className="text-center self-center ">
          {notif.sender.username} wants to be friend with you
        </p>
        <div className="flex flex-col justify-center gap-1 py-2 text-xs">
          <button
            className=" rounded-md py-1 px-[0.6rem] bg-[#605cac] "
            onClick={handleAccept}
          >
            accept
          </button>
          <button
            className="rounded-md py-1 px-[0.6rem] border border-[#605cac] text-[#605cac]"
            onClick={handleDecline}
          >
            decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
