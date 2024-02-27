/* eslint-disable @next/next/no-img-element */
'use client';
import { ChangeEvent, useState, useEffect, FormEvent } from 'react';
import getCurrentUser from '@/services/getCurrentUser';
import { MdModeEdit } from 'react-icons/md';
import getAllUsers from '@/services/getAllUsers';
import Link from 'next/link';
import { IoIosArrowRoundBack } from 'react-icons/io';
import uploadAvatar from '@/services/uploadAvatar';
import verifyNumber from '@/services/verifyNumber';
import modifyUser from '@/services/modifyUser';
import getAllNumberss from '@/services/getAllNumbers';
import confirmCode from '@/services/confirmCode';
import { toast, ToastContainer } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

export interface Data {
  id: number;
  username: string;
  avatar: string;
  phoneNumber: string | null;
  newAvatar: File | null;
  code: number | null;
  settings: {
    twoFactorEnabled: boolean;
    verified: boolean;
  };
}

interface Users {
  username: string;
}

const defaultData: Data = {
  id: -1,
  username: '',
  avatar: '',
  phoneNumber: null,
  newAvatar: null,
  code: null,
  settings: {
    twoFactorEnabled: false,
    verified: false,
  },
};

const fileErrorMessage = {
  0: 'valid',
  1: 'file too large',
  2: 'forbidden file extension',
};

const userNameErrorMessage = {
  0: 'valid',
  1: 'Username already exists! Please choose another one.',
  2: 'Entry must be 8+ lowercase letters and may include one mid-string hyphen.',
};

const Settings = () => {
  const [data, setData] = useState<Data>(defaultData);
  const [newData, setNewData] = useState<Data>(defaultData);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [Users, setUsers] = useState<Users[]>();
  const [fileError, setFileError] = useState<0 | 1 | 2>(0);
  const [usernameError, setUsernameError] = useState<0 | 1 | 2>(0);
  const [validNumber, setValidNumber] = useState(true);
  const [inputCode, setInputCode] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (res) {
        const ret: Data = res;
        setData(ret);
        setNewData(ret);
        setData((prev) => {
          return {
            ...prev,
            avatar: process.env.BACKEND + `/api/users/${prev.id}/avatar`,
          };
        });
        setNewData((prev) => {
          return {
            ...prev,
            phoneNumber: '',
            avatar: process.env.BACKEND + `/api/users/${prev.id}/avatar`,
          };
        });
      }
    });

    getAllUsers().then((res) => {
      res && setUsers(res);
    });

    getAllNumberss().then((res) => res && setNumbers(res));
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
      setNewData((prev) => {
        return {
          ...prev,
          avatar: URL.createObjectURL(file),
          newAvatar: file,
        };
      });
    } else {
      setTimeout(() => {
        setFileError(0);
        setNewData((prev) => {
          return {
            ...prev,
            avatar: data.avatar,
            newAvatar: null,
          };
        });
      }, 3000);
    }
  };

  const isValidUsername = (name: string) => {
    const regex = /^(?=[a-z-]{8,}$)[a-z]+(?:-[a-z]+)?$/;

    if (Users?.some((obj) => obj.username === name)) {
      setUsernameError(1);
      return false;
    }
    if (!regex.test(name)) {
      setUsernameError(2);
      return false;
    }
    setUsernameError(0);
    return true;
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;

    if (name === '') {
      setUsernameError(0);
    } else if (isValidUsername(name)) {
      setNewData((prev) => ({
        ...prev,
        username: name,
      }));
    } else {
      setNewData((prev) => ({
        ...prev,
        username: '',
      }));
    }
  };

  const isValidNumber = (num: string) => {
    const regex = /^\+212\d{9}$/;

    if (
      regex.test(num) &&
      num != data.phoneNumber &&
      numbers.every((number) => number !== num)
    ) {
      setValidNumber(true);
      return true;
    } else {
      setValidNumber(false);
      return false;
    }
  };

  const handlePhoneNumberChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;

    if (number === '') {
      setValidNumber(true);
    } else if (isValidNumber(number)) {
      setNewData((prev) => ({
        ...prev,
        phoneNumber: number,
      }));
    } else {
      setNewData((prev) => ({
        ...prev,
        phoneNumber: '',
      }));
    }
  };

  const verifyNewNumber = async () => {
    const number = newData.phoneNumber || '';

    if (number != '' && isValidNumber(number)) {
      verifyNumber(number).then((res) => {
        if (res) setInputCode(true);
        else {
          setNewData((prev) => ({
            ...prev,
            phoneNumber: '',
          }));
        }
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let id = data.id;
    try {
      if (newData.newAvatar) await uploadAvatar(newData.newAvatar);

      if (newData.username != '' && newData.username != data.username) {
        modifyUser(id, { username: newData.username });
      }

      if (
        newData.phoneNumber &&
        newData.phoneNumber != '' &&
        newData.settings.verified
      ) {
        modifyUser(id, { phoneNumber: newData.phoneNumber });
        modifyUser(id, { settings: { verified: false } });
      }

      if (
        newData.settings.twoFactorEnabled != data.settings.twoFactorEnabled &&
        newData.settings.verified
      ) {
        modifyUser(id, {
          settings: {
            twoFactorEnabled: newData.settings.twoFactorEnabled,
          },
        });
      }

      toast.success('Updated successfully!');
    } catch (error) {
      toast.error('An error has occured!');
    }

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handleVerificationCode = async (e: ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toString();

    if (code.length === 6) {
      confirmCode(code, newData.phoneNumber).then((res) => {
        if (res) {
          setNewData((prev) => ({
            ...prev,
            settings: {
              ...prev.settings,
              verified: true,
            },
          }));
        }
      });
      setInputCode(false);
    }
  };

  const handleToggle = async () => {
    if (newData.phoneNumber === '' && !data.phoneNumber)
      toast.info('U need to provide a phone number first!');
    else {
      setNewData((prev) => ({
        ...prev,
        settings: {
          verified: prev.settings.verified,
          twoFactorEnabled: !prev.settings.twoFactorEnabled,
        },
      }));
    }
  };

  return (
    <form
      className=" flex flex-col justify-center gap-10 "
      onSubmit={handleSubmit}
    >
      <ToastContainer autoClose={3000} className={'absolute'} />
      {/* edit image */}
      <div className="m-auto">
        <div className="relative inline-block m-auto ">
          <img
            src={newData.avatar}
            alt="  "
            width={100}
            height={100}
            className="w-28 h-28 rounded-full border-4 border-purple-400/50 object-cover"
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
        {fileError > 0 && (
          <p className="text-red-500 text-xs ">{fileErrorMessage[fileError]}</p>
        )}
      </div>

      {/* edit username */}
      <div className="flex flex-col gap-1 ">
        <div className="flex justify-center gap-2">
          <input
            type="text"
            id="username"
            maxLength={25}
            placeholder={data.username !== '' ? data.username : 'username'}
            onChange={handleUsernameChange}
            className="w-3/5 h-12 rounded-xl border-2 border-purple-400/50 bg-white/5 outline-none px-4
       text-white/60 text-md font-normal placeholder:opacity-40 
      "
          />
        </div>
        {usernameError > 0 && (
          <p className="text-red-500 text-xs mx-auto">
            {userNameErrorMessage[usernameError]}
          </p>
        )}
      </div>

      {/* edit phone number */}
      <div>
        <div className={`flex justify-center gap-2`}>
          <div className="w-3/5 relative h-12">
            <input
              type="text"
              id="phone-number"
              maxLength={13}
              placeholder={
                data.phoneNumber ? data.phoneNumber : '+212 XXX XXX XXX'
              }
              onChange={handlePhoneNumberChange}
              className={`w-full h-full rounded-xl border-2 border-purple-400/50 bg-white/5 self-center outline-none px-4
            text-white/60 text-md font-normal placeholder:opacity-40 `}
            />
            <label
              htmlFor="phone-number"
              className="cursor-pointer  self-center rounded-full w-[1.3rem] h-[1.3rem] bg-white/10 flex justify-center
                        absolute right-2 bottom-[0.95rem]"
            >
              <div
                className="flex relative"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <FaCheck
                  className="text-purple-500 font-bold self-center w-[0.8rem] h-[0.8rem]"
                  onClick={() => verifyNewNumber()}
                />
                <p
                  className={`${!hover && 'hidden'}  absolute bg-white/20 -bottom-10 -left-1 p-2 
                          rounded-md text-xs text-white/60`}
                >
                  verify
                </p>
              </div>
            </label>
          </div>
        </div>
        {!validNumber && (
          <p className="text-red-500 text-xs mx-auto w-3/5 mt-2">
            invalid phone number!
          </p>
        )}
      </div>

      {/* 2FA  */}
      <div className="flex items-center text-white  m-auto">
        <label
          htmlFor="toggleSwitch"
          className={` relative w-10 h-5 bg-gray-300 rounded-full transition-transform duration-300 ease-in-out outline outline-2 outline-purple-400/50 cursor-pointer ${
            newData.settings.twoFactorEnabled
              ? 'bg-purple-400/50'
              : 'bg-white/5'
          }`}
        >
          <input
            type="checkbox"
            id="toggleSwitch"
            className="sr-only"
            onClick={handleToggle}
          />
          <div
            className={`absolute w-5 h-5  rounded-full transform transition-transform duration-300 ease-in-out cursor-none ${
              newData.settings.twoFactorEnabled
                ? 'translate-x-full bg-white'
                : 'bg-white/80'
            }`}
          ></div>
        </label>
        <span className="ml-2 text-white/80">Two Factor Authentication </span>
      </div>

      {/* verification code */}
      <div
        className={`w-3/12 self-center text-sm -ml-6 -mt-4 flex flex-col gap-2 ${!inputCode && 'hidden'}`}
      >
        <p className="text-white/80"> Verification Code </p>
        <input
          type="number"
          id="verification code"
          maxLength={6}
          onChange={handleVerificationCode}
          placeholder="_ _ _ _ _ _"
          className={`w-full h-10 rounded-xl border-2 border-purple-400/50 bg-white/5 self-center outline-none px-4
        text-white/60 text-md font-normal placeholder:opacity-40 text-center appearance-none}
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
      </div>

      {/* Submit form */}
      <div className=" mb-0 flex justify-between w-4/5 slef-center mx-auto ">
        <Link
          href={'/dashboard'}
          className="text-white/80 b py-1 px-2 rounded-lg bg-blue-400/70 hover:bg-blue-400/90"
        >
          <p className="flex ">
            <IoIosArrowRoundBack className="self-center" />
            home
          </p>
        </Link>
        <button
          type="submit"
          className=" text-white/80  px-4 py-1 rounded-lg  bg-purple-400/50 hover:bg-purple-400/70"
        >
          save
        </button>
      </div>
    </form>
  );
};
export default Settings;
