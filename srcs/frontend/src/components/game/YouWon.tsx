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
      className="md:w-[30rem] md:h-[20rem] border-8 border-white/30 self-center bg-[#17194A] rounded-[3.5rem]
      flex flex-col gap-8 justify-center  shadow-lg py-px"
    >
        <div className="self-center">
        <Crown color={''} width={''} height={''} />
        </div>
      <div className="flex flex-col gap-4 self-center">
          <FaCrown className="text-[#E89B05] w-12 h-12 self-center drop-shadow-[0_0px_9px_rgba(232,155,5,0.6)]"/>
        <ProfileAvatar
          avatar={process.env.BACKEND + `/api/users/${user.id}/avatar`}
          experiencePoints={user.stats.exp}
          level={user.stats.level}
        />
        <h1 className="text-sm text-white self-center">Congratulations</h1>
        <h1 className="text-2xl text-white self-center">
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
