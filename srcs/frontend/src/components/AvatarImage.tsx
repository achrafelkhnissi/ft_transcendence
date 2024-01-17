import { useEffect, useState } from "react";
import getCurrentUser from "../services/getCurrentUser";
import Image from "next/image";
import getAvatar from "@/services/getAvatar";

const AvatarImage = () => {
  // const [avatar, setAvatar] = useState<null | string>(null);
  const [src, setSrc] = useState<string> ("");
  useEffect(() => {

    getCurrentUser().then((res) => {
          setSrc(`http://localhost:3000/api/users/${res.username}/avatar`);
    }
    );
  }, []);

  if (src != "")
    return (
      <img
        src={src}
        alt="user"
        width={40}
        height={40}
        className="rounded-lg"
      />
    );
};

export default AvatarImage;
