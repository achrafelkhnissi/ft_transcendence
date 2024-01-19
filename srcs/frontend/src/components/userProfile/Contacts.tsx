
import Link from "next/link";
import { useEffect, useState } from "react";
import sendFriendRequest from "@/services/sendFriendRequest";
import removeFriend from "@/services/removeFriend";
import cancelFriendRequest from "@/services/cancelFriendRequest";
import { stat } from "fs";
import { useSocket } from "@/contexts/socketContext";
import { ContactsItems, FriendshipStatus } from "./types";
import createNewConv from "@/services/createNewConv";

interface ContactsProps {
  username: string;
  me: boolean;
  status: false | FriendshipStatus;
  url: string;
  id: number | null;
}


const Contacts: React.FC<ContactsProps> = ({ username, me, status, url , id}) => {

  const [isClicked, setIsClicked] = useState<"send" | "cancel" | "">("");
  const [friendshipState, setFriendshipState] = useState<FriendshipStatus | false>(status);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      // Listen for the 'connect' event
      console.log(socket)
      socket.on('connect', () => {
        console.log({
          message: 'Connected to socket server from userContact',
          socketId: socket.id,
        });

        // You can also log the socket ID
        console.log('Socket ID:', socket.id);
      });
    }
  },[])

  useEffect(() => {
    setFriendshipState(status);
  }, [status])
  
  useEffect(() => {

    if (isClicked == "send"  ) {
      sendFriendRequest(username).then((res) => {
        setIsClicked("");
         setFriendshipState(res.request.friendshipStatus);
      });
    }
    else if ( isClicked == "cancel" ){
      cancelFriendRequest(username).then( (res) => {
        setIsClicked("");
         setFriendshipState(false);
      });
    }
  }, [isClicked, username, friendshipState]);

  const createRoom = () => {
    const convo = {
      type: "DM", 
      to: id,
    }

    createNewConv(convo).then( (res) => {
      console.log("created ");
      console.log(res);
      
      socket?.emit('createRoom', {
        roomName: res.name,
        type: res.type,
        to: username,
      })

      console.log('socket joined room')
    })
  }
  
  return (
    <div className="flex justify-center gap-4 px-6">


      {!me && friendshipState == false && (
        <button
          onClick={() => {
            setIsClicked("send")
            console.log('sending');
          }}
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
          onClick={() => {
            setIsClicked("cancel");
          }}
          className={`
          rounded-xl
          bg-[${ContactsItems.cancelRequest.color}]
          p-2
          `}
          >
          {ContactsItems.cancelRequest.icon}
        </button>
      )}
      {
        !me && friendshipState == FriendshipStatus.ACCEPTED && (
          <button
          disabled
          className={`
          rounded-xl
          bg-[${ContactsItems.acceptRequest.color}]
          p-2
          `}>
            {ContactsItems.acceptRequest.icon}
            </button>
        )
      }

      {!me && 
      <button
      onClick={() => {console.log('clicked') ;createRoom()}}

      className={`
      rounded-xl
      bg-[${ContactsItems.sendMessage.color}]
      p-2`}>
        {ContactsItems.sendMessage.icon}
      </button>
      
      }
      
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
