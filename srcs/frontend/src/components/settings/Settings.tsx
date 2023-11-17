"use client";
import Image from "next/image";
import { ChangeEvent, useState, useEffect } from "react";
import getCurrentUser from "@/services/getCurrentUser";
import { MdModeEdit } from "react-icons/md";
import getAllUsers from "@/services/getAllUsers";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";

export interface Data {
  username: string;
  avatar: string;
  twoFA: boolean;
  phoneNumber: string | null;
}

interface Users {
  username: string;
}

const defaultData: Data = {
  username: "",
  avatar: "",
  twoFA: false,
  phoneNumber: null,
};

const Settings = () => {
  const [data, setData] = useState<Data>(defaultData);
  const [editUserName, setEditUserName] = useState<boolean>(false);
  const [editPhoneNumber, setEditPhoneNumber] = useState<boolean>(false);
  const [isSwitchOn, setSwitchOn] = useState(false);
  const [Users, setUsers] = useState<Users[]>();
  const [unique, setUnique] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser().then((res) => {
      const ret: Data = res;
      setData(ret);
    });

    // getAllUsers().then((res) => {
    setUsers([
      { username: "fathjami" },
      { username: "ael-khni" },
      { username: "zsarir" },
    ]);
    // });
  }, []);

  const handleToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //check if there is a number provided;
    if (data.phoneNumber && data.phoneNumber !== "") setSwitchOn(true);
    // send verification code to enabe 2FA
  };

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
    const name = e.target.value;
    if (name === "" || Users?.every((obj) => !obj.username.includes(name))) {
      setUnique(true);
      setData((prev) => ({
        ...prev,
        username: name,
      }));
    } else setUnique(false);
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      phoneNumber: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log(data.username);
  };

  const handleEditPhoneNumber = () => {
    if (!data.phoneNumber) setEditPhoneNumber(true);
    else {
      // send a verificatin code to the prev number
      // when verified allow the user to modify the number
    }
  };

  return (
    <form className=" flex flex-col justify-center py-8 gap-10">
      {/* edit image */}
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
            <MdModeEdit className=" self-center text-lg -mt-[0.1rem] text-purple-500 font-bold w-4 h-4" />
          </label>
          <input
            type="file"
            id="avatar"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* edit username */}
      <div className="flex flex-col gap-1 ">
        <div className="flex justify-center gap-2">
          <input
            type="text"
            id="username"
            readOnly={!editUserName}
            placeholder={data.username !== "" ? data.username : "username"}
            onChange={handleUsernameChange}
            className="w-3/5 h-12 rounded-xl border-2 border-purple-400/50 bg-white/5 outline-none px-4
       text-white/60 text-md font-normal placeholder:opacity-40
      "
          />
          <label
            htmlFor="username"
            className="cursor-pointer border self-center rounded-full w-[1.3rem] h-[1.3rem] text-white  bg-white flex justify-center"
          >
            <MdModeEdit
              className="text-purple-500 font-bold self-center w-4 h-4"
              onClick={() => setEditUserName(true)}
            />
          </label>
        </div>
        {!unique && (
          <p className="text-red-500 text-xs mx-auto">
            Username already exists. Please choose another one.
          </p>
        )}
      </div>

      {/* edit phone number */}
      <div className={`flex justify-center gap-2 `}>
        <input
          type="text"
          id="phone-number"
          readOnly={!editPhoneNumber}
          placeholder={data.phoneNumber ? data.phoneNumber : "+212 XXX XXX"}
          onChange={handlePhoneNumberChange}
          className={`w-3/5 h-12 rounded-xl border-2 border-purple-400/50 bg-white/5 self-center outline-none px-4
       text-white/60 text-md font-normal placeholder:opacity-40 `}
        />
        <label
          htmlFor="phone-number"
          className="cursor-pointer border self-center rounded-full w-[1.3rem] h-[1.3rem] text-white  bg-white flex justify-center"
        >
          <MdModeEdit
            className="text-purple-500 font-bold self-center w-4 h-4"
            onClick={handleEditPhoneNumber}
          />
        </label>
      </div>

      {/* 2FA  */}
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
            readOnly={isSwitchOn}
            //make it editibale if the phoneNumber exitsts
          />
          <div
            className={`absolute w-5 h-5  rounded-full transform transition-transform duration-300 ease-in-out cursor-none ${
              isSwitchOn ? "translate-x-full bg-white" : "bg-white/80"
            }`}
          ></div>
        </label>
        <span className="ml-2 text-white/80">Two Factor Authentication </span>
      </div>

      {/* Submit form */}
      <div className=" mt-14 flex justify-between w-4/5 slef-center mx-auto ">
        <Link
          href={"/dashboard"}
          className="text-white/80 b py-1 px-2 rounded-lg bg-blue-400/70 hover:bg-blue-400/90"
        >
          <p className="flex ">
            <IoIosArrowRoundBack className="self-center"/>
            home
          </p>
        </Link>
        <button
          className=" text-white/80  px-4 py-1 rounded-lg  bg-purple-400/50 hover:bg-purple-400/70"
          onClick={handleSubmit}
        >
          save
        </button>
      </div>
    </form>
  );
};
export default Settings;
