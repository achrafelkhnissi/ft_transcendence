import { useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { IoAdd } from 'react-icons/io5';
import { MdModeEdit } from 'react-icons/md';
import { RiAddFill } from 'react-icons/ri';

const CreateChannel = () => {
  const [privateChannel, setPrivate] = useState<boolean>(false);
  const [lockedChannel, setProtected] = useState<boolean>(false);

  return (
    <div className="pt-8 flex justify-center flex-col gap-6 px-6">
      <h1 className="mx-auto text-white font-bold text-2xl">New Channel</h1>
      <div className="flex justify-center gap-6">
        <div className="relative">
          <img
            src="/images/channel2.webp"
            alt=""
            // width={1200}
            // height={600}
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
            <input type="file" id="channelImage" className="sr-only" />
          </div>
        </div>
        <input
          type="text"
          id="channelName"
          maxLength={25}
          placeholder="Channel Name"
          className=" w-2/5 h-10 self-center outline-none border-2 border-blue-500/80 px-4 text-sm text-white
                            rounded-[0.7rem] bg-white/5 placeholder:text-sm placeholder:opacity-40"
        />
      </div>
      {/* Accessibility */}
      <div className="flex flex-col gap-4 justify-center pt-4">
        <h2 className=" text-white mb-3">Accessibility</h2>

        <div className="flex gap-2  items-center text-white">
          <label
            htmlFor="privateSwitch"
            className={` relative w-10 h-5 bg-gray-300 rounded-full transition-transform duration-300 ease-in-out outline outline-2 outline-blue-400/50 cursor-pointer ${
              privateChannel ? 'bg-blue-400/50' : 'bg-white/5'
            }`}
          >
            <input
              type="checkbox"
              id="privateSwitch"
              className="sr-only"
              onClick={() => {
                setPrivate((prev) => !prev);
                if (lockedChannel) setProtected(false);
              }}
            />
            <div
              className={`absolute w-5 h-5  rounded-full transform transition-transform duration-300 ease-in-out cursor-none ${
                privateChannel ? 'translate-x-full bg-white' : 'bg-white/80'
              }`}
            ></div>
          </label>

          <span className="ml-2 text-white/80">Make Channel Private </span>
        </div>

        <div className="flex gap-2  items-center text-white">
          <label
            htmlFor="lockSwitch"
            className={` relative w-10 h-5 bg-gray-300 rounded-full transition-transform duration-300 ease-in-out outline outline-2 outline-blue-400/50 cursor-pointer ${
              lockedChannel ? 'bg-blue-400/50' : 'bg-white/5'
            }`}
          >
            <input
              type="checkbox"
              id="lockSwitch"
              className="sr-only"
              onClick={() => {
                setProtected((prev) => !prev);
                if (privateChannel) setPrivate(false);
              }}
            />
            <div
              className={`absolute w-5 h-5  rounded-full transform transition-transform duration-300 ease-in-out cursor-none ${
                lockedChannel ? 'translate-x-full bg-white' : 'bg-white/80'
              }`}
            ></div>
          </label>
          <span className="ml-2 text-white/80">Lock Channel </span>
        </div>
      </div>
      {/* Memembers    */}
      <div className="flex flex-col gap-2 justify-center pt-4">
        <h2 className="text-white">Members</h2>
      </div>
    </div>
  );
};

export default CreateChannel;
