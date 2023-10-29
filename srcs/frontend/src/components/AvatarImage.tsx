import { useEffect, useState } from "react";
import getCurrentUser from "../services/getCurrentUser";
import Image from "next/image";

const AvatarImage = () => {
  const [avatar, setAvatar] = useState<null | string>(null);

  useEffect(() => {

    getCurrentUser().then((res) => {
      setAvatar(res.avatar);
    });

    // return () => abortController.abort();
  }, []);

  if (avatar)
    return (
      <Image
        src={avatar}
        alt="user"
        width={40}
        height={40}
        className="rounded-lg"
      />
    );
};

export default AvatarImage;
