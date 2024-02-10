/* eslint-disable @next/next/no-img-element */
import { FiMinusCircle } from 'react-icons/fi';

interface MemberProps {
  id: number | undefined;
  username: string;
  avatar: string;
  role: string;
  status: string;
}

const Member: React.FC<MemberProps> = ({
  avatar,
  username,
  role,
  status,
  id,
}) => {
  return (
    <div className="w-full h-14 bg-white/10  rounded-2xl flex justify-between px-4 relative">
      <div className="self-center flex justify-center gap-2 md:text-sm text-xs ">
        <img
          src={process.env.BACKEND + `/api/users/${id}/avatar`}
          alt=""
          className="w-10 h-10 rounded-full self-center object-cover"
        />
        <div>
          <p className="self-center">{username}</p>
          <p className="self-center text-xs text-white/30">{role}</p>
        </div>
      </div>
      <div className='self-center'>
        <FiMinusCircle 
        className="w-[1.2rem] h-[1.2rem] text-white/60 cursor-pointer"/>
      </div>
    </div>
  );
};

export default Member;
