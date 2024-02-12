/* eslint-disable @next/next/no-img-element */
import kickUser from '@/services/kickUser';
import { FiMinusCircle } from 'react-icons/fi';
import { BiMessageAltX } from 'react-icons/bi';
import { useState } from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import addAdmin from '@/services/addAmin';
import { TbHammer } from 'react-icons/tb';
import banUser from '@/services/banUser';
import { TbHammerOff } from 'react-icons/tb';
import unbanUser from '@/services/unbanUser';
import removeAdmin from '@/services/removeAdmin';
import unmuteUser from '@/services/unmuteUser';
import muteUser from '@/services/muteUser';

interface MemberProps {
  id: number | undefined;
  channelId: number;
  username: string;
  avatar: string;
  role: string;
  status: string;
  muted: boolean;
  updateConversations: Function;
  currentUserRole: string;
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
  currentUserRole,
}) => {
  const [muteOnHover, setMuteOnHover] = useState<boolean>(false);
  const [muteClicked, setMuteClicked] = useState<boolean>(false);
  const [adminHover, setAdminHover] = useState<boolean>(false);
  const [banHover, setBanHover] = useState<boolean>(false);

  const handleKickUser = () => {
    kickUser(id, channelId).then((res) => {
      if (res) {
        updateConversations(res);
      }
    });
  };

  const handleAdmin = () => {
    if (role == 'admin') {
      removeAdmin(id, channelId).then((res) => {
        if (res) {
          updateConversations(res);
        }
      });
    } else {
      addAdmin(id, channelId).then((res) => {
        if (res) {
          updateConversations(res);
        }
      });
    }
  };

  const handleMuteUser = (param: string) => {
    if (param == 'UNMUTE') {
      console.log('unmute');
      unmuteUser(id, channelId).then((res) => {
        if (res) {
          console.log('unmute', res);
        }
      });
    } else {
      console.log('duration', param);
      muteUser(id, channelId, param).then((res) => {
        if (res) {
          console.log('mute', res);
        }
      });
    }
  };

  // TODO: Remove this!
  const handleBanUser = () => {
    if (role == 'banned') {
      unbanUser(id, channelId).then((res) => {
        if (res) {
          // updateConversations(res);
        }
      });
    } else {
      banUser(id, channelId).then((res) => {
        if (res) {
          console.log({ res });
          // updateConversations(res);
        }
      });
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
      {role != 'owner' &&
        role != 'banned' &&
        (currentUserRole == 'owner' || // owner can modify all roles
          (currentUserRole == 'admin' && role == '')) && ( // admin can modify only members
          <div className="self-center flex gap-1">
            <div
              className="self-center relative"
              onClick={handleAdmin}
              onMouseEnter={(e) => {
                setAdminHover(true);
              }}
              onMouseLeave={(e) => {
                setAdminHover(false);
              }}
            >
              <MdOutlineAdminPanelSettings
                className={` cursor-pointer
            ${role == 'admin' ? `text-yellow-300` : `text-yellow-700`}`}
              />
              {adminHover && (
                <p className="absolute text-[0.6rem] text-white/70 bottom-5 -right-2 bg-white/20 px-[0.2rem] rounded-sm w-16 text-center">
                  {role == 'admin' ? 'remove admin' : 'make admin'}
                </p>
              )}
            </div>

            <div
              className="self-center relative"
              onClick={() => {
                if (muted) handleMuteUser('UNMUTE');
                else setMuteClicked((prev) => !prev);
              }}
              onMouseEnter={(e) => {
                setMuteOnHover(true);
              }}
              onMouseLeave={(e) => {
                setMuteOnHover(false);
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
              )}{' '}
              {muteOnHover && !muted && (
                <p className="absolute text-[0.6rem] text-white/70 bottom-6 -right-1 bg-white/20 px-[0.2rem] rounded-sm">
                  mute
                </p>
              )}
              {muteClicked && !muted && (
                <div
                  className="absolute bottom-[1.4rem] text-[0.6rem] w-content flex -right-3 flex-col w-14
              gap-1 text-center "
                >
                  <p
                    className={`bg-red-600/55 p-[0.1rem] rounded-md text-white/70 hover:text-white cursor-pointer
                 `}
                    onClick={() => handleMuteUser('MINUTE')}
                  >
                    1-MINITUE
                  </p>
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
                </div>
              )}
            </div>
            <div
              className="self-center relative"
              onMouseEnter={(e) => {
                setBanHover(true);
              }}
              onMouseLeave={(e) => {
                setBanHover(false);
              }}
              onClick={handleBanUser}
            >
              <TbHammer className="text-blue-500/80 cursor-pointer" />
              {banHover && (
                <p className="absolute text-[0.6rem] text-white/70 bottom-5 -right-2 bg-white/20 px-[0.4rem] rounded-sm">
                  ban
                </p>
              )}
            </div>
            <div className="self-center " onClick={handleKickUser}>
              <FiMinusCircle className="w-[1.2rem] h-[1.2rem] text-white/60 cursor-pointer" />
            </div>
          </div>
        )}
      {role == 'banned' && (
        <div
          className="self-center relative"
          onMouseEnter={(e) => {
            setBanHover(true);
          }}
          onMouseLeave={(e) => {
            setBanHover(false);
          }}
          onClick={handleBanUser}
        >
          <TbHammerOff className="text-blue-500/80 cursor-pointer" />
          {banHover && (
            <p className="absolute text-[0.6rem] text-white/70 bottom-5 -right-2 bg-white/20 px-[0.4rem] rounded-sm">
              unban
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Member;
