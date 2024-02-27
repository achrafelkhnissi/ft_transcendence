import AvatarImage from '../AvatarImage';
import ProfileAvatar from '../userProfile/ProfileAvatar';
import { User } from '../userProfile/types';
import { BiCloudLightning } from "react-icons/bi";


interface props {
  user: User;
}
const YouLose: React.FC<props> = ({ user }) => {
  return (
    <div
      className="w-[18rem] md:w-[30rem] md:h-[20rem] border-4 border-white/30 self-center bg-[#17194A] rounded-[2rem]
      flex flex-col justify-center shadow-lg p-4"
    >
      <div className="flex flex-col gap-4 self-center">
          <BiCloudLightning className=" w-10 h-10 md:w-14 md:h-14 self-center text-white/30 drop-shadow-[0_0px_9px_rgba(255,255,255)]"/>
        <div className="flex flex-col gap-[1rem]">
        <ProfileAvatar
          avatar={process.env.BACKEND + `/api/users/${user.id}/avatar`}
          experiencePoints={user.stats.exp}
          level={user.stats.level}
        />
        <h1 className="md:text-sm text-xs  text-white self-center">Oops!</h1>
        </div>
        <h1 className="md:text-2xl text-base  text-white self-center">
          You
          <span className="text-white/30 font-bold drop-shadow-[0_0px_9px_rgba(255,255,255,0.6)]">
            {' '}
            Lost{' '}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default YouLose;
