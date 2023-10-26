import Image from "next/image";
import Link from "next/link";

const Avatar = () => {

  return (
    <Link href={"/user-profile"}>
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
      >
        <Image
          src="/images/fathjami.jpeg"
          alt="user"
          width={40}
          height={40}
          className="rounded-lg"
        />
      </div>
    </Link>
  );
};

export default Avatar;
