import { GrNotification } from "react-icons/gr";
import { IoNotificationsOutline } from "react-icons/io5";

const Notifications = () => {
  return (
    <div className=" self-center relative">
      <IoNotificationsOutline
        color="red"
        style={{
          color: "white",
          opacity: 0.6,
          width: "1.7rem",
          height: "1.7rem",
        }}
      />
      <div className="absolute  top-[0.1rem] right-[0.15rem]  w-[0.6rem] h-[0.6rem]">
        <span className="animate-ping absolute h-full w-full rounded-full bg-white/95 "></span>
        <span className="bg-[#6257FE] h-full w-full absolute rounded-full "></span>
      </div>
    </div>
  );
};

export default Notifications;
