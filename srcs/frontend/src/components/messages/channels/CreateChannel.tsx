/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { IoAdd } from 'react-icons/io5';
import { MdModeEdit } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';
import { Conversation, ConversationsMap, User } from '../data';
import getUser from '@/services/getUser';
import { ToastContainer, toast } from 'react-toastify';
import getAllChannelNames from '@/services/getAllChannelNames';
import uploadChannelImage from '@/services/uploadChannelImage';
import createNewConv from '@/services/createNewConv';
import 'react-toastify/dist/ReactToastify.css';
import { useSocket } from '@/contexts/socketContext';
import { PiEyeBold } from 'react-icons/pi';
import { PiEyeClosedBold } from 'react-icons/pi';
import { hashPassword } from '../hashPass';
import axios from 'axios';

interface NewChannel {
  type: string;
  image?: string;
  name?: string;
  password: string;
  participants: number[];
  participantsInfos: User[];
  imageFile: File | null;
  newImage: string;
}

const defaultChannel: NewChannel = {
  type: 'PUBLIC',
  image: '',
  newImage: '/images/channel2.webp',
  imageFile: null,
  name: '',
  password: '',
  participants: [],
  participantsInfos: [],
};

const fileErrorMessage = {
  0: 'valid',
  1: 'file too large',
  2: 'forbidden file extension',
};

const channelNameErrorMessage = {
  0: 'valid',
  1: 'Channel name already exists! Please choose another one.',
  2: 'Entry must be 6+ lowercase letters and may include one mid-string hyphen.',
};

const newMemberError = {
  0: 'valid',
  1: 'user already exist!',
  2: 'invalid user!',
};

interface props {
  currentUser: User | undefined;
  conversationsMap: ConversationsMap;
  updateSelectedConversation: Function;
  updateConversations: Function;
  updateCreateChannelState: Function;
}

const CreateChannel: React.FC<props> = ({
  currentUser,
  conversationsMap,
  updateConversations,
  updateSelectedConversation,
  updateCreateChannelState,
}) => {
  const [newChannel, setNewChannel] = useState<NewChannel>(defaultChannel);
  const [fileError, setFileError] = useState<0 | 1 | 2>(0);
  const [channelNameError, setChannelNameError] = useState<0 | 1 | 2>(0);
  const [memberError, setMemeberError] = useState<0 | 1 | 2>(0);
  const [channelNames, setChannelNames] = useState<string[]>([]);
  const [newMember, setNewMember] = useState<string>('');
  const [weakPasswrod, setWeakPassword] = useState<boolean>(false);
  const [visiblePass, setVisiblePass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const { socket } = useSocket();

  useEffect(() => {
    getAllChannelNames().then((res) => {
      if (res) setChannelNames(res);
    });
  }, []);

  const isValidFile = (file: File) => {
    const maxSize = 1024 * 1024 * 2; // 2MB
    const extension = /\.(jpeg|jpg|png)$/;

    if (file.size > maxSize) {
      setFileError(1);
      return false;
    }
    if (!extension.test(file.name)) {
      setFileError(2);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && isValidFile(file)) {
      setFileError(0);
      setNewChannel((prev) => {
        return {
          ...prev,
          newImage: URL.createObjectURL(file),
          imageFile: file,
        };
      });
    } else {
      setTimeout(() => {
        setNewChannel((prev) => {
          return {
            ...prev,
            newImage: '/images/channel2.webp',
            imageFile: null,
          };
        });
        setFileError(0);
      }, 3000);
    }
  };

  const isValidChannelName = (name: string) => {
    const regex = /^(?=[a-z-]{6,}$)[a-z]+(?:-[a-z]+)?$/;

    if (channelNames?.some((str) => str === name)) {
      setChannelNameError(1);
      return false;
    }
    if (!regex.test(name)) {
      setChannelNameError(2);
      return false;
    }
    setChannelNameError(0);
    return true;
  };

  const handleChannelName = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;

    if (newName === '') {
      setChannelNameError(0);
    } else if (isValidChannelName(newName)) {
      setNewChannel((prev) => ({
        ...prev,
        name: newName,
      }));
    } else {
      setNewChannel((prev) => ({
        ...prev,
        name: '',
      }));
    }
  };

  const handleNewMemmber = () => {
    if (newMember != '' && newMember != currentUser?.username) {
      getUser(newMember).then((res) => {
        if (res) {
          if (newChannel.participants.every((id) => id != res.id)) {
            setMemeberError(0);
            setNewChannel((prev) => {
              return {
                ...prev,
                participants: [...prev.participants, res.id],
                participantsInfos: [...prev.participantsInfos, res],
              };
            });
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

  const deleteMember = (id: number | undefined) => {
    const newParicipantsInfos = newChannel.participantsInfos.filter(
      (member) => member.id != id,
    );
    const newParticipants = newChannel.participants.filter((num) => id != num);

    setNewChannel((prev) => {
      return {
        ...prev,
        participantsInfos: newParicipantsInfos,
        participants: newParticipants,
      };
    });
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const pass = e.target.value;

    if (pass == '') {
      setWeakPassword(false);
    } else if (passwordRegex.test(pass)) {
      setWeakPassword(false);
      setPassword(pass);
    } else {
      setWeakPassword(true);
      setPassword('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let img : string | undefined = newChannel.image;

    let hashedpass = '';

    if (newChannel.name != '') {
      if (newChannel.imageFile) {
        img = await uploadChannelImage(newChannel.imageFile);
      }
      if (password != '') {
        try {
          hashedpass = await hashPassword(password);
        } catch {
          toast.error('something went wrong!');
          updateCreateChannelState(false);
        }
      }
      
      createNewConv({
        type: newChannel.type,
        image: img,
        name: newChannel.name,
        password: hashedpass,
        participants: newChannel.participants,
      }).then((res) => {
        if (res) {
          toast.success('Channel created successfully!');
          // updateConversations(data.id);
        }
      });

      setTimeout(() => {
        updateCreateChannelState(false);
      }, 1500);
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} className={'absolute'} />
      <form
        onSubmit={handleSubmit}
        className="md:pt-8 pt-2 flex justify-start flex-col md:gap-6 gap-2 md:px-6 px-2 relative w-full h-full"
      >
        <h1 className="mx-auto text-white font-bold md:text-2xl text-lg">
          New Channel
        </h1>
        <div className="flex justify-center gap-6">
          <div className="relative">
            <img
              src={newChannel.newImage}
              alt=""
              className="w-[4.6rem] h-[4.6rem] border-[3px] border-blue-500/80 rounded-full object-cover self-center"
            />
            <div className="absolute bottom-6 -right-2">
              <label
                htmlFor="channelImage"
                className="rounded-full bg-white flex justify-center w-[1.2rem] h-[1.2rem] "
              >
                <RiAddFill
                  className=" self-center text-lg  text-blue-500/80 font-bold w-8 h-8
                                                    cursor-pointer "
                />
              </label>
              <input
                type="file"
                id="channelImage"
                className="sr-only"
                onChange={handleFileChange}
              />
            </div>

            {fileError > 0 && (
              <p className="text-red-500 text-xs absolute text-center w-24 -ml-3 mt-1">
                {fileErrorMessage[fileError]}
              </p>
            )}
          </div>
          {/* channel name */}
          <div className="relative w-2/5 h-10 self-center ">
            <input
              type="text"
              required
              id="channelName"
              maxLength={25}
              onChange={handleChannelName}
              placeholder="Channel Name"
              className=" w-full h-full outline-none border-2 border-blue-500/80 px-4 md:text-sm text-xs text-white
                            rounded-[0.7rem] bg-white/5 md:placeholder:text-sm placeholder:opacity-40 placeholder:text-[0.65rem]"
            />
            {channelNameError > 0 && (
              <p className="text-red-500 md:text-xs text-[0.65rem] absolute right-0 mt-1">
                {channelNameErrorMessage[channelNameError]}
              </p>
            )}
          </div>
        </div>
        {/* Accessibility */}
        <div className="flex flex-col md:gap-4 gap-2 justify-center pt-2 relative md:pb-4 pb-10">
          <h2 className=" text-white mb-3">Accessibility</h2>

          <div className="flex gap-2  items-center text-white">
            <label
              htmlFor="privateSwitch"
              className={` relative w-10 h-5 bg-gray-300 rounded-full transition-transform duration-300 ease-in-out outline outline-2 outline-blue-400/50 cursor-pointer ${
                newChannel.type === 'PRIVATE' ? 'bg-blue-500/80' : 'bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                id="privateSwitch"
                className="sr-only"
                onClick={() => {
                  setNewChannel((prev) => {
                    return {
                      ...prev,
                      type: prev.type === 'PRIVATE' ? 'PUBLIC' : 'PRIVATE',
                    };
                  });
                }}
              />
              <div
                className={`absolute w-5 h-5  rounded-full transform transition-transform duration-300 ease-in-out cursor-none ${
                  newChannel.type === 'PRIVATE'
                    ? 'translate-x-full bg-white'
                    : 'bg-white/80'
                }`}
              ></div>
            </label>

            <span className="ml-2 text-white/80">Make Channel Private </span>
          </div>
          {/* protected Channel */}
          <div className="flex gap-2  items-center text-white">
            <label
              htmlFor="lockSwitch"
              className={` relative w-10 h-5 bg-gray-300 rounded-full transition-transform duration-300 ease-in-out outline outline-2 outline-blue-400/50 cursor-pointer ${
                newChannel.type === 'PROTECTED'
                  ? 'bg-blue-500/80'
                  : 'bg-white/5'
              }`}
            >
              <input
                type="checkbox"
                id="lockSwitch"
                className="sr-only"
                onClick={() => {
                  setNewChannel((prev) => {
                    return {
                      ...prev,
                      type: prev.type === 'PROTECTED' ? 'PUBLIC' : 'PROTECTED',
                    };
                  });
                }}
              />
              <div
                className={`absolute w-5 h-5  rounded-full transform transition-transform duration-300 ease-in-out cursor-none ${
                  newChannel.type === 'PROTECTED'
                    ? 'translate-x-full bg-white'
                    : 'bg-white/80'
                }`}
              ></div>
            </label>
            <span className="ml-2 text-white/80">Lock Channel </span>
          </div>
          {newChannel.type === 'PROTECTED' && (
            <div className="w-[8.5rem] h-[2.3rem] absolute md:right-[5.4rem] md:bottom-2 right-0 -bottom-[0.2rem]">
              <input
                type={visiblePass ? 'text' : 'password'}
                onChange={handlePassword}
                id="password"
                required
                placeholder="password"
                className="w-full h-full outline-none border-2 border-blue-500/80 pr-6 pl-2 text-xs text-white
                    rounded-[0.7rem] bg-white/5 md:placeholder:text-sm placeholder:opacity-40 md:text-sm placeholder:text-xs
                    relatve "
              />
              {weakPasswrod && (
                <p className="md:text-xs  text-[0.6rem] text-red-600 w-40 pt-1">
                  Password must be strong: 8+ chars, upper/lowercase, digits,
                  special chars.
                </p>
              )}
              {!visiblePass && (
                <PiEyeBold
                  className="absolute top-[0.6rem] right-[0.55rem] text-white/70 w-4 h-4 cursor-pointer
                                hover:text-white "
                  onClick={() => {
                    setVisiblePass(true);
                  }}
                />
              )}{' '}
              {visiblePass && (
                <PiEyeClosedBold
                  className="absolute top-[0.6rem] right-[0.55rem] text-white/70 w-4 h-4 cursor-pointer
                                hover:text-white "
                  onClick={() => {
                    setVisiblePass(false);
                  }}
                />
              )}
            </div>
          )}
        </div>
        {/* Memembers    */}
        <div className="flex flex-col gap-2 justify-center pt-4  text-sx md:text-sm">
          <h2 className="text-white">Members</h2>
          <div className="relative md:w-2/5 h-10  ">
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
              <p className="absolute text-red-600 text-xs left-2 pt-[0.2rem]">
                {newMemberError[memberError]}
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-2  overflow-x-auto scroll-smooth w-full">
            {newChannel.participantsInfos.map((member, index) => {
              return (
                <div
                  key={index}
                  className="w-24 h-24 border-2 border-blue-500 rounded-[0.9rem] flex justify-center flex-col gap-2 p-2 relative bg-white/5
                                  flex-none "
                >
                  <img
                    src={member.avatar}
                    alt="member"
                    className="rounded-full h-12 w-12 border-2 self-center "
                  />
                  <p className="self-center text-white/90 text-xs md:text-sm">
                    {' '}
                    {member.username}{' '}
                  </p>
                  <span
                    className="absolute -top-[0.2rem] right-1 text-red-700 font-bold cursor-pointer"
                    onClick={() => deleteMember(member.id)}
                  >
                    x
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          className="w-24 h-12 p-2 absolute bg-blue-400/70 hover:bg-blue-400/60 text-white/90
            bottom-6 left-1/2 transform -translate-x-1/2 
            rounded-xl cursor-pointer "
        >
          Create
        </button>
      </form>
    </>
  );
};

export default CreateChannel;
