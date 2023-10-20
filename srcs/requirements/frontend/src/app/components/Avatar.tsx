import { FaUserAlt } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Avatar = () => {
  const router = useRouter();

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
     outline-gray-400/60
     cursor-pointer`}
     onClick={() => router.push("/user-profile")}
    >
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
