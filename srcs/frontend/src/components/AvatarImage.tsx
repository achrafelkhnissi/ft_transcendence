import { useEffect, useState } from 'react';
import getCurrentUser from '../services/getCurrentUser';
import Image from 'next/image';

const AvatarImage = () => {
  // const [avatar, setAvatar] = useState<null | string>(null);
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    getCurrentUser().then((res) => {
      setSrc(process.env.BACKEND + `/api/users/${res.id}/avatar`);
    });
  }, []);

  if (src != '')
    return (
      <img
        src={src}
        alt="user"
        width={40}
        height={40}
        className="rounded-lg object-fill"
      />
    );
};

export default AvatarImage;
