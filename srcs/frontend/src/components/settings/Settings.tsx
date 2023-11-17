"use client";
import Image from "next/image";
import { ChangeEvent, useState, useEffect } from "react";
import getCurrentUser from "@/services/getCurrentUser";

export interface Data {
  username: string;
  avatar: string;
  twoFA: boolean;
}

const defaultData: Data = {
  username: "",
  avatar: "",
  twoFA: false,
};

const Settings = () => {
  const [data, setData] = useState<Data>(defaultData);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setData((prev) => {
        return {
          ...prev,
          avatar: URL.createObjectURL(file),
        };
      });
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      username: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log(data.username);
  };

  const [isSwitchOn, setSwitchOn] = useState(false);

  const handleToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSwitchOn(e.target.checked);
  };

  useEffect(() => {
    getCurrentUser().then((res) => {
      const ret: Data = res;
      setData(ret);
    });
  }, []);

  return (
    <form className=" flex flex-col justify-center py-8 gap-10">
      <div className="relative inline-block m-auto">
        <Image
          src={data.avatar}
          alt="image"
          width={100}
          height={100}
          className="w-28 h-28 rounded-full border-4 border-purple-400/50 object-fill"
        />
        <div className="flex items-center absolute bottom-2 right-2">
          <label
            htmlFor="avatar"
            className="cursor-pointer border rounded-full w-[1.3rem] h-[1.3rem] text-white flex justify-center bg-white"
          >
            <p className=" self-center text-lg -mt-[0.1rem] text-purple-500 font-bold ">
              +
            </p>
          </label>
          <input
            type="file"
            id="avatar"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <input
        type="text"
        id="username"
        placeholder={data.username}
        onChange={handleUsernameChange}
        className="w-3/5 h-12 rounded-xl border-2 border-purple-400/50 bg-white/5 self-center outline-none px-4
       text-white/60 text-md font-normal placeholder:opacity-40
      "
      />
        <input
          type="text"
          id="phone-number"
          placeholder={"XXXXXXXX41"}
          // onChange={handleUsernameChange}
          className={`w-3/5 h-12 rounded-xl border-2 border-purple-400/50 bg-white/5 self-center outline-none px-4
       text-white/60 text-md font-normal placeholder:opacity-40 ${!isSwitchOn && "hidden"}`}
        />
      <div className="flex items-center text-white  m-auto">
        <label
          htmlFor="toggleSwitch"
          className={` relative w-10 h-5 bg-gray-300 rounded-full transition-transform duration-300 ease-in-out outline outline-2 outline-purple-400/50 cursor-pointer ${
            isSwitchOn ? "bg-purple-400/50" : "bg-white/5"
          }`}
        >
          <input
            type="checkbox"
            id="toggleSwitch"
            checked={isSwitchOn}
            onChange={handleToggleChange}
            className="sr-only"
          />
          <div
            className={`absolute w-5 h-5  rounded-full transform transition-transform duration-300 ease-in-out cursor-none ${
              isSwitchOn ? "translate-x-full bg-white" : "bg-white/80"
            }`}
          ></div>
        </label>
        <span className="ml-2 text-white/80">Two Factor Authentication </span>
      </div>
      <button
        className=" text-white/80 m-auto px-4 py-1 rounded-lg absolute bottom-20 right-10  bg-purple-400/50 "
        onClick={handleSubmit}
      >
        save
      </button>
    </form>
  );
};
export default Settings;
