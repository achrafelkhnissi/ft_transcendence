/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

interface FriendAvatarProps {
  avatar: string;
  name: string;
}

const FriendAvatar: React.FC<FriendAvatarProps> = ({ avatar, name }) => {
  return (
    <div className=" flex gap-1 flex-col justify-center p-1">
      <Link href={`/profile/${name}`}>
        <div className="relative self-center p-1 flex justify-center">
          <img
            src={avatar}
            alt=""
            width={60}
            height={60}
            className=" rounded-full relative w-12 h-`12   
                        outline 
                        outline-2 
                        outline-offset-[1.5px]
                        outline-gray-400/70 
                        object-cover"
          />
        </div>
        <p className="self-center text-center  text-white/70 text-sm font-light">
          {name}
        </p>
      </Link>
    </div>
  );
};

export default FriendAvatar;
