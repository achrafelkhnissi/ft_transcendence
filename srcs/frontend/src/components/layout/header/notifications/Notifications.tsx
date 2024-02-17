/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client';

import { GrNotification } from 'react-icons/gr';
import { IoNotificationsOutline } from 'react-icons/io5';
import { IoIosNotificationsOutline } from 'react-icons/io';
import getNotifications from '@/services/getNotification';
import { useEffect, useState } from 'react';
import FriendRequest from './FriendRequest';
import { useSocket } from '@/contexts/socketContext';

export interface NotificationsType {
  id: number;
  type: string;
  sender: {
    id: number;
    username: string;
    avatar: string;
  };
  receiver: {
    id: number;
    username: string;
    avatar: string;
  };
  requestId: number;
}

const Notifications = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [notifications, setNotifications] = useState<NotificationsType[]>([]);
  const [read, setRead] = useState(true);
  const { socket } = useSocket();

  const deleteNotif = (id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };
  const handleClick = () => {
    setIsClicked((prev) => !prev);
    setRead(true);
  };

  useEffect(() => {
    getNotifications().then((res) => {
      const notif: NotificationsType[] = res;
      setNotifications(notif);
      console.log('notif', notif);
      if (notif.length > 0) {
        setRead(false);
      }
    });

    if (socket) {
      socket.on('onNotification', (data: NotificationsType) => {
        console.log('new notification', data);
        setNotifications((prev) => [data, ...prev]);
        setRead(false);
      });
      socket.on(
        'friend-request-cancelled',
        (data: { senderId: number; receiverId: number; requestId: number }) => {
          console.log('friend-request-cancelled', data);
          setNotifications((prev) =>
            prev.filter((item) => item.requestId !== data.requestId),
          );
        },
      );
      socket.on('friend-request-accepted', (data) => {
        console.log('friend-request-accepted', data);
        setNotifications((prev) =>
          prev.filter(
            (item) =>
              item.requestId !== data.id && item.receiver.id !== data.sender.id,
          ),
        );
      });
    }
  }, [socket]);

  return (
    <div
      className={`${
        isClicked && 'bg-white/10'
      } rounded-lg h-9 w-9 flex justify-center cursor-pointer `}
    >
      <div className=" relative self-center ">
        <IoIosNotificationsOutline
          color="red"
          style={{
            color: 'white',
            opacity: 0.6,
            width: '1.9rem',
            height: '1.9rem',
          }}
          onClick={handleClick}
        />
        <div
          className={`absolute  top-[0.22rem] right-[0.3rem]  w-[0.5rem] h-[0.5rem] ${
            (notifications.length === 0 || read) && 'hidden'
          }`}
        >
          <span className="animate-ping absolute h-full w-full rounded-full bg-white/95 "></span>
          <span className="bg-[#6257FE] h-full w-full absolute rounded-full "></span>
        </div>
        <div
          className={`absolute max-h-80 sm:w-80 w-60 z-50 sm:right-0 -right-6  bg-white/30  rounded-[0.5rem] ${
            !isClicked && 'hidden'
          } mt-1  p-2 overflow-hidden`}
        >
          <div className="w-full overflow-y-auto scroll-smooth h-full">
            <div className="flex gap-1 flex-col">
              {notifications.length === 0 && (
                <p className="text-sm text-center text-white">
                  {' '}
                  find some firends{' '}
                </p>
              )}
              {notifications.map((item, index) => {
                if (item.type == 'FRIEND_REQUEST_SENT')
                  return (
                    <FriendRequest
                      deleteNotif={deleteNotif}
                      notif={item}
                      key={index}
                    />
                  );
                else if (item.type == 'FRIEND_REQUEST_ACCEPTED')
                  return (
                    <div
                      key={index}
                      className={`bordder text-white/80 w-full h-20 text-[0.8rem] px-2 font-normal 
                      bg-[#3A386A]  flex justify-between rounded-2xl gap-2 transition-all ease-in duration-300
                    `}
                    >
                      <img
                        src={
                          process.env.BACKEND +
                          `/api/users/${item.sender.id}/avatar`
                        }
                        className="w-[2.5rem] h-[2.5rem] rounded-full object-fill self-center"
                      />
                      <p className="sm:text-sm text-[0.7rem] text-white self-center ">
                        <span className="font-bold ≈">
                          {' '}
                          {item.sender.username}{' '}
                        </span>
                        accepted your friend request
                      </p>
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
