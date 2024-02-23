/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import getCurrentUser from '../services/getCurrentUser';

const AvatarImage = () => {
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res) setSrc(process.env.BACKEND + `/api/users/${res.id}/avatar`);
    });
  }, []);

  if (src != '')
    return (
      <img src={src} alt="user" width={40} height={40} className="rounded-lg object-fill" />
    );
};

export default AvatarImage;
