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
  requestId: number;
}

const Notifications = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [notifications, setNotifications] = useState<NotificationsType[]>([]);
  const { socket } = useSocket();

  const handleClick = () => {
    setIsClicked((prev) => !prev);
  };

  useEffect(() => {
    getNotifications().then((res) => {
      const notif: NotificationsType[] = res;
      setNotifications(notif);
    });

    if (socket) {
      socket.on('onNotification', (data: NotificationsType) => {
        console.log('new notification', data);
        setNotifications((prev) => [data, ...prev]);
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
            notifications.length === 0 && 'hidden'
          }`}
        >
          <span className="animate-ping absolute h-full w-full rounded-full bg-white/95 "></span>
          <span className="bg-[#6257FE] h-full w-full absolute rounded-full "></span>
        </div>
        <div
          className={`absolute max-h-80 w-80 z-10 right-0 bg-white/30  rounded-[0.5rem] ${
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
                  return <FriendRequest {...item} key={index} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
