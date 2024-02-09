'use client';
import { useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import { ChangeEvent } from 'react';
import { Conversation, User } from '../data';
import Member from './Member';
import getUser from '@/services/getUser';
import { FaCheck } from 'react-icons/fa';
import addNewMember from '@/services/addMember';
import updateChannelType from '@/services/updateChannelType';
import { hashPassword } from '../hashPass';
import leaveChannel from '@/services/leaveChannel';

interface ChannelInfoProps {
  channel: Conversation;
  addAdmin: Function;
  currentUser: User | undefined;
  updateConversations: Function;
  removeConversation: Function;
}

const newMemberError = {
  0: 'valid',
  1: 'user already exist!',
  2: 'invalid user!',
};

const ChannelInfo: React.FC<ChannelInfoProps> = ({
  channel,
  addAdmin,
  updateConversations,
  currentUser,
  removeConversation,
}) => {
  const length = channel.participants.length + channel.admins.length + 1;
  const [newMember, setNewMember] = useState<string>('');
  const [memberError, setMemeberError] = useState<0 | 1 | 2>(0);
  const [channelType, setChannelType] = useState<string>(channel.type);
  const [password, setPassword] = useState<string>('');
  const [weakPasswrod, setWeakPassword] = useState<boolean>(false);

  const handleNewMemmber = () => {
    if (newMember != '' && newMember != currentUser?.username) {
      getUser(newMember).then((res) => {
        if (res) {
          if (
            channel.participants.every((obj) => obj.id != res.id) &&
            channel.admins.every((obj) => obj != res.id) &&
            channel.owner.id != res.id
          ) {
            addNewMember(res.id, channel.id).then((res) => {
              if (res) {
                console.log('add member res:', res);
                updateConversations(res);
              }
            });
            setMemeberError(0);
          } else {
            setMemeberError(1);
          }
        } else {
          setMemeberError(2);
        }
      });
      setNewMember('');
      setTimeout(() => {
        setMemeberError(0);
      }, 4000);
    }
  };

  const handleLeaveChannel = () => {
    leaveChannel(channel.id, currentUser?.id).then((res) => {
      if (res) {
        removeConversation(channel.id);
      }
    });
  };

  const modifyChannelType = async (newChannelType: string) => {
    let hashedpass = '';

    if (newChannelType != 'PROTECTED') {
      updateChannelType(channel.id, { type: newChannelType }).then((res) => {
        if (res) {
          console.log('updateChannelType res:', res);
          updateConversations(res);
          setChannelType(newChannelType);
        }
      });
    } else {
      if (password != '') {
        try {
          hashedpass = await hashPassword(password);
          updateChannelType(channel.id, {
            type: newChannelType,
            password: hashedpass,
          }).then((res) => {
            if (res) {
              console.log('updateChannelType res:', res);
              updateConversations(res);
              setChannelType(newChannelType);
            } else {
              setChannelType(channel.type);
            }
            setPassword('');
          });
        } catch (error) {
          console.log('Error hashing password: ', error);
        }
      }
    }
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const pass = e.target.value;

    if (pass === '') {
      setWeakPassword(false);
    } else if (passwordRegex.test(pass)) {
      setWeakPassword(false);
      setPassword(pass);
    } else {
      setWeakPassword(true);
      setPassword('');
    }
  };

  return (
    <div
      className="w-full h-full  rounded-lg bg-[#101038] shadow-2xl p-4 
                        flex flex-col gap-4 "
    >
      <h1 className="self-center md:text-[1.5rem] text-xl text-white/90 font-semibold">
        Channel Info
      </h1>
      <div className="flex flex-col justify-center py-2 gap-2">
        <img
          src={process.env.BACKEND + `/api/users/chat/${channel.id}/avatar`}
          alt=""
          className="md:w-[7rem] md:h-[7rem] w-[6rem] h-[6rem] rounded-full self-center  object-cover
                shadow-[0_0px_15px_5px_rgba(255,255,255,0.3)]"
        />
        <p className="self-center md:text-[1.2rem] text-sm">{channel.name}</p>
      </div>
      {/* accessibility */}
      {channel.owner.id === currentUser?.id && (
        <div className="flex flex-col ">
          <h2 className=" text-white mb-3">Accessibility</h2>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2  items-center text-white">
              <label
                htmlFor="privateSwitch"
                className={` relative w-10 h-5 bg-gray-300 rounded-full transition-transform duration-300 ease-in-out outline outline-2 outline-blue-400/50 cursor-pointer ${
                  channelType === 'PRIVATE' ? 'bg-blue-500/90' : 'bg-white/5'
                }`}
              >
                <input
                  type="checkbox"
                  id="privateSwitch"
                  className="sr-only"
                  onClick={(e) => {
                    modifyChannelType(
                      channelType === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE',
                    );
                  }}
                />
                <div
                  className={`absolute w-5 h-5  rounded-full transform transition-transform duration-300 ease-in-out cursor-none ${
                    channelType === 'PRIVATE'
                      ? 'translate-x-full bg-white'
                      : 'bg-white/80'
                  }`}
                ></div>
              </label>
              <span className="ml-2 text-white/80">Make Channel Private </span>
            </div>
            {/* ///lock */}
            <div className="flex gap-4 flex-col items-center text-white relative">
              <div className="w-full h-full flex gap-2">
                <label
                  htmlFor="lockSwitch"
                  className={` relative w-10 h-5 bg-gray-300 rounded-full transition-transform duration-300 ease-in-out outline outline-2 outline-blue-400/50 cursor-pointer ${
                    channelType === 'PROTECTED'
                      ? 'bg-blue-500/90'
                      : 'bg-white/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    id="lockSwitch"
                    className="sr-only"
                    onClick={(e) => {
                      setChannelType((prev) =>
                        prev === 'PROTECTED' ? 'PUBLIC' : 'PROTECTED',
                      );
                    }}
                  />
                  <div
                    className={`absolute w-5 h-5  rounded-full transform transition-transform duration-300 ease-in-out cursor-none ${
                      channelType === 'PROTECTED'
                        ? 'translate-x-full bg-white'
                        : 'bg-white/80'
                    }`}
                  ></div>
                </label>
                <span className="ml-2 text-white/80">Lock Channel </span>
              </div>
              <div
                className={`md:w-[12rem] w-[10rem] relative flex flex-col justify-center self-start 
              ${channelType != 'PROTECTED' && 'hidden'}`}
              >
                <div className="relative w-full flex justify-center self-start  h-10">
                  <input
                    type="text"
                    id="password"
                    maxLength={13}
                    placeholder={
                      channel.type == 'PROTECTED' ? '**********' : 'password'
                    }
                    onChange={handlePassword}
                    className={`w-full h-full rounded-xl border-2 border-blue-500/80 bg-white/5 self-center outline-none px-4
                  text-white/60 text-md font-normal placeholder:opacity-40 md:text-md text-sm placeholder:text-sm`}
                  />
                  <label
                    htmlFor="password"
                    className="cursor-pointer  self-center rounded-full w-[1.3rem] h-[1.3rem] bg-white/10 flex justify-center
                  absolute right-2 "
                  >
                    <FaCheck
                      className="text-blue-500 font-bold self-center w-[0.8rem] h-[0.8rem]"
                      onClick={() => {
                        modifyChannelType('PROTECTED');
                      }}
                    />
                  </label>
                </div>
                {weakPasswrod && (
                  <p className="md:text-xs  text-[0.6rem] text-red-600 w-full pl-2  pt-1 ">
                    Password must be strong: 8+ chars, upper/lowercase, digits,
                    special chars.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Members */}
      <div className="flex flex-col gap-2 text-sm md:text-[1rem] pb-2">
        <h3 className="">{length} members</h3>
        {/* add member */}
        <div className="relative w-full h-10 mb-2">
          <input
            type="text"
            id="new-member"
            maxLength={13}
            placeholder={'Add memeber'}
            value={newMember}
            onChange={(e) => {
              setNewMember(e.target.value);
            }}
            className={`w-full h-full rounded-[0.7rem] border-2 border-blue-500/80 bg-white/5 outline-none px-4
                  text-white text-xs font-normal placeholder:opacity-40 placeholder:text-xs md:placeholder:text-sm`}
          />
          <label
            htmlFor="new-member"
            className="cursor-pointer rounded-full w-[1.3rem] h-[1.3rem] bg-white flex justify-center
                              absolute right-2 bottom-[0.7rem] "
            onClick={handleNewMemmber}
          >
            <RiAddFill className="text-blue-500 font-bold self-center w-8 h-8 -mb-[0.07rem]" />
          </label>
          {memberError > 0 && (
            <p className="absolute text-red-600 text-[0.7rem] -bottom-4 left-2 pt-[0.2rem]">
              {newMemberError[memberError]}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-col overflow-y-auto max-h-[500px] px-2">
          <Member
            id={channel.owner.id}
            username={channel.owner.username}
            avatar={channel.owner.avatar}
            role={'owner'}
            status={channel.owner.status}
          />
          {channel.admins.map((admin, index) => {
            return (
              <div key={index} className="text-white/80">
                <Member
                  id={admin.id}
                  username={admin.username}
                  avatar={admin.avatar}
                  role={'admin'}
                  status={admin.status}
                />
              </div>
            );
          })}
          {channel.participants.map((participant, index) => {
            return (
              <div key={index} className="text-white/80 ">
                <Member
                  id={participant.id}
                  username={participant.username}
                  avatar={participant.avatar}
                  role={''}
                  status={participant.status}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="self-center flex">
        <button
          className="px-4 py-2 bg-red-800 rounded-lg text-white/80 cursor-pointer hover:bg-red-700"
          onClick={handleLeaveChannel}
        >
          leave channel
        </button>
      </div>
    </div>
  );
};

export default ChannelInfo;
