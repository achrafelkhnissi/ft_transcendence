import AvatarImage from '../AvatarImage';
import ProfileAvatar from '../userProfile/ProfileAvatar';
import { User } from '../userProfile/types';
import { FaCrown } from "react-icons/fa";



interface props {
  user: User;
}
const YouWon: React.FC<props> = ({ user }) => {
  return (
    <div
      className="md:w-[30rem] md:h-[20rem] w-[18rem] border-4 border-white/30 self-center bg-[#17194A] rounded-[2rem]
      flex flex-col justify-center shadow-lg p-4"
    >
      <div className="flex flex-col gap-4 self-center">
          <FaCrown className="text-[#E89B05] w-10 h-10 md:w-12 md:h-12 self-center drop-shadow-[0_0px_9px_rgba(232,155,5,0.6)]"/>
        <div className="flex flex-col gap-[1rem]">
        <ProfileAvatar
          avatar={process.env.BACKEND + `/api/users/${user.id}/avatar`}
          experiencePoints={user.stats.exp}
          level={user.stats.level}
        />
        <h1 className="md:text-sm text-xs text-white self-center">Congratulations</h1>
        </div>
        <h1 className="md:text-2xl text-base text-white self-center">
          You
          <span className="text-[#E89B05] font-bold drop-shadow-[0_0px_9px_rgba(232,155,5,0.6)]">
            {' '}
            WON{' '}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default YouWon;
