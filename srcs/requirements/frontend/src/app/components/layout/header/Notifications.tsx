import { GrNotification } from "react-icons/gr";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";

const Notifications = () => {
  return (
    <div className="hover:bg-white/10 rounded-lg h-9 w-9 flex justify-center ">
    <div className=" relative self-center ">
      <IoIosNotificationsOutline
        color="red"
        style={{
          color: "white",
          opacity: 0.6,
          width: "1.9rem",
          height: "1.9rem",
        }}
      />
      <div className="absolute  top-[0.22rem] right-[0.3rem]  w-[0.5rem] h-[0.5rem]">
        <span className="animate-ping absolute h-full w-full rounded-full bg-white/95 "></span>
        <span className="bg-[#6257FE] h-full w-full absolute rounded-full "></span>
      </div>
    </div>
    </div>
  );
};

export default Notifications;
