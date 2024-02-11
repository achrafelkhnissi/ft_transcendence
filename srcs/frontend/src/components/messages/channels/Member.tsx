/* eslint-disable @next/next/no-img-element */
import kickUser from '@/services/kickUser';
import { FiMinusCircle } from 'react-icons/fi';
import { BiMessageAltX } from 'react-icons/bi';
import { BiMessageAltMinus } from 'react-icons/bi';
import { useState } from 'react';

interface MemberProps {
  id: number | undefined;
  channelId: number;
  username: string;
  avatar: string;
  role: string;
  status: string;
  muted: boolean;
  updateConversations: Function;
}

const Member: React.FC<MemberProps> = ({
  avatar,
  username,
  role,
  muted,
  status,
  id,
  channelId,
  updateConversations,
}) => {
  const [muteOnHover, setMuteOnHover] = useState<boolean>(false);

  const handleKickUser = () => {
    kickUser(id, channelId, role).then((res) => {
      if (res) {
        updateConversations(res);
      }
    });
  };

  const handleMuteUser = (param: string) => {
    if (param == 'UNMUTE') {
      console.log('unmute');
    } else{
      console.log('duration', param);
    }
  };

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
      {role != 'owner' && (
        <div className="self-center flex gap-1">
          <div
            className="self-center relative"
            onMouseEnter={(e) => {
              setMuteOnHover(true);
            }}
            onMouseLeave={(e) => {
              setMuteOnHover(false);
            }}
            onClick={() => {
              if (muted) 
                handleMuteUser('UNMUTE');
            }}
          >
            <BiMessageAltX
              className={`mt-1 cursor-pointer
              ${muted == true ? 'text-red-600' : 'text-red-600/40'}`}
            />
            {muteOnHover && muted && (
              <p className="absolute text-[0.6rem] text-white/70 bottom-5 -right-2 bg-white/20 px-[0.2rem] rounded-sm">
                unmute
              </p>
            )}
            {muteOnHover && !muted && (
              <div
                className="absolute bottom-4 text-[0.6rem] w-content flex right-5 flex-col w-14
              gap-1 text-center "
              >
                <p
                  className={`bg-red-600/55 p-[0.1rem] rounded-md text-white/70 hover:text-white cursor-pointer
                 `}
                  onClick={() => handleMuteUser('HOUR')}
                >
                  1-HOUR
                </p>
                <p
                  className={`bg-red-600/55 p-[0.1rem] rounded-md text-white/70 hover:text-white cursor-pointer
                 `}
                  onClick={() => handleMuteUser('DAY')}
                >
                  1-DAY
                </p>
                <p
                  className={`bg-red-600/55 p-[0.1rem] rounded-md text-white/70 hover:text-white cursor-pointer
                  `}
                  onClick={() => handleMuteUser('WEEK')}
                >
                  1-WEEK
                </p>
              </div>
            )}
          </div>
          <div className="self-center" onClick={handleKickUser}>
            <FiMinusCircle className="w-[1.2rem] h-[1.2rem] text-white/60 cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
