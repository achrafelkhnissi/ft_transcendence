import { NotificationsType } from "./Notifications";

const FriendRequest: React.FC<NotificationsType> = (notif) => {
  return (
    <div className="bordder  text-white w-full h-20 text-sm p-2 ">
      <p className="text-center">{notif.content}</p>
      <div className="flex justify-center gap-4 py-2">
        <button className="px-4 py-[0.4rem] bg-[#6257FE] rounded-md">accept</button>
        <button className="px-4 py-[0.4rem] bg-red-600">decline</button>
      </div>
    </div>
  );
};

export default FriendRequest;
