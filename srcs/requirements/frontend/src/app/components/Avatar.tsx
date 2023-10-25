import { FaUserAlt } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Avatar = () => {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const strodeId = localStorage.getItem("id");
      const  id :string =  strodeId?.toString() || '';
    setId(id);
  }, []);

    const { data, isLoading, isError } = useQuery({
      queryKey: ["user", id],
      queryFn: async () => {
        const { data } = await axios.get(
          "http://localhost:3000/api/auth/whoami",
          {
            withCredentials: true,
          }
        );
        setAvatar(data.avatar);
        return data;
      },
    });
  

  // if (isLoading)
  //   return (
  // <div> loading...</div>
  // )
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
        src={avatar}
        alt="user"
        width={40}
        height={40}
        className="rounded-lg"
      />
    </div>
  );
};

export default Avatar;
