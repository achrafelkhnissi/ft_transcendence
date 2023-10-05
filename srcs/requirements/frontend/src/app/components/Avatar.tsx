import { FaUserAlt } from "react-icons/fa";
import Image from "next/image";

const Avatar = () => {
  return (
    <div
      className={`h-[2rem] 
    w-[2rem] 
    bg-gray-400/60
     rounded-lg 
     flex 
     justify-center 
     items-center 
     outline 
     outline-2 
     outline-offset-[1.5px]
     outline-gray-400/60`}
    >
      {/* <FaUserAlt
        style={{
          color: "white",
          opacity: 0.6,
        }}
      /> */}
      <Image
        src="/images/fathjami.jpeg"
        alt="user"
        width={40}
        height={40}
        className="rounded-lg"
      />
    </div>
  );
};

export default Avatar;
