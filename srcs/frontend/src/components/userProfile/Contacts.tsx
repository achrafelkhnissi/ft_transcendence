import Link from 'next/link';
import { useEffect, useState } from 'react';
import sendFriendRequest from '@/services/sendFriendRequest';
import removeFriend from '@/services/removeFriend';
import cancelFriendRequest from '@/services/cancelFriendRequest';
import { useSocket } from '@/contexts/socketContext';
import { ContactsItems, FriendshipStatus } from './types';
import createNewConv from '@/services/createNewConv';
import { useRouter } from 'next/navigation';

interface ContactsProps {
  username: string;
  me: boolean;
  status: false | FriendshipStatus;
  url: string;
  id: number | null;
}

const Contacts: React.FC<ContactsProps> = ({
  username,
  me,
  status,
  url,
  id,
}) => {
  const [isClicked, setIsClicked] = useState<'send' | 'cancel' | ''>('');
  const [friendshipState, setFriendshipState] = useState<
    FriendshipStatus | false
  >(status);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('friend-request-declined', (data) => {
        setFriendshipState(false);
      });
      socket.on('friend-request-accepted', (data) => {
        console.log('friend-request-accepted', data);
        setFriendshipState(FriendshipStatus.ACCEPTED);
      });
      socket.on('friend-removed', (data) => {
        setFriendshipState(false);
      });
    }
  }, [socket]);

  useEffect(() => {
    setFriendshipState(status);
  }, [status]);

  const router = useRouter();
  const createRoom = async () => {
    const payload = {
      type: 'DM',
      participants: id ? [id] : [],
    };

    createNewConv(payload).then((res) => {
      if (res) {
        router.push(`/messages/${res.id}`);
      }
    });
  };

  const handleSendFriendRequest = () => {
    sendFriendRequest(id).then((res) => {
      res && setFriendshipState(res.friendshipStatus);
    });
  };

  const handleCancelFriendRequest = () => {
    cancelFriendRequest(id).then((res) => {
      console.log({ res });
      res && setFriendshipState(false);
    });
  };

  const handleRemoveFriend = () => {
    removeFriend(id).then((res) => {
      res && setFriendshipState(false);
    });
  };

  return (
    <div className="flex justify-center gap-4 px-6">
      {!me && friendshipState == false && (
        <button
          onClick={handleSendFriendRequest}
          className={`
          rounded-xl
          bg-[${ContactsItems.sendRequest.color}]
          p-2
          `}
        >
          {ContactsItems.sendRequest.icon}
        </button>
      )}
      {!me && friendshipState == FriendshipStatus.PENDING && (
        <button
          onClick={handleCancelFriendRequest}
          className={`
          rounded-xl
          bg-[${ContactsItems.cancelRequest.color}]
          p-2
          `}
        >
          {ContactsItems.cancelRequest.icon}
        </button>
      )}
      {!me && friendshipState == FriendshipStatus.ACCEPTED && (
        <button
          onClick={handleRemoveFriend}
          className={`
          rounded-xl
          bg-[${ContactsItems.acceptRequest.color}]
          p-2
          `}
        >
          {ContactsItems.acceptRequest.icon}
        </button>
      )}

      {!me && (
        <button
          onClick={() => {
            createRoom();
          }}
          className={`
      rounded-xl
      bg-[${ContactsItems.sendMessage.color}]
      p-2`}
        >
          {ContactsItems.sendMessage.icon}
        </button>
      )}

      <Link
        target="_blank"
        href={url}
        className={`
        rounded-xl
                        bg-[#6257FE]
                        p-2
                        `}
      >
        {ContactsItems.intra.icon}
      </Link>
    </div>
  );
};

export default Contacts;
