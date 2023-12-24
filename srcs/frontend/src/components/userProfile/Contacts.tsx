import { TbMessageCircle2Filled } from "react-icons/tb";
import { TiUserAdd } from "react-icons/ti";
import Logo_42 from "../logos/Logo_42";
import Link from "next/link";
import { BiUserCheck, BiUserX, BiUserPlus } from "react-icons/bi";
import { FriendshipStatus } from "@/app/(site)/profile/[...name]/page";
import { useEffect, useState } from "react";
import sendFriendRequest from "@/services/sendFriendRequest";
import removeFriend from "@/services/removeFriend";
import cancelFriendRequest from "@/services/cancelFriendRequest";
import { stat } from "fs";

interface ContactsProps {
  username: string;
  me: boolean;
  status: false | FriendshipStatus;
  url: string;
}
interface ContactsItemsProps {
  label: string;
  href: string;
  color: string;
  icon: React.ReactNode;
}

const ContactsItems: { [key: string]: ContactsItemsProps } = {
  sendMessage: {
    label: "send a message",
    href: "/conversation",
    color: "#31A350",
    icon: (
      <TbMessageCircle2Filled className="text-white w-6 h-6 bg-[#31A350]" />
    ),
  },
  sendRequest: {
    label: "send a friend request",
    href: "/friend-request",
    color: "#3385FF",
    icon: <BiUserPlus className="text-white w-6 h-6 bg-[#3385FF]" />,
  },
  cancelRequest: {
    label: "cancel friend request",
    href: "/friend-request",
    color: "#3385FF",
    icon: <BiUserX className="text-white w-6 h-6 bg-[#3385FF]" />,
  },
  acceptRequest: {
    label: "accept friend request",
    href: "/friend-request",
    color: "#3385FF",
    icon: <BiUserCheck className="text-white w-6 h-6 bg-[#3385FF]" />,
  },
  intra: {
    label: "intra profile ",
    href: "/profile-intra",
    color: "#6257FE",
    icon: <Logo_42 color="white" width="1.7rem" height="1.5rem" />,
  },
};

interface statePorps {
  isClicked: "send" | "cancel" | "friend" | "";
}

const Contacts: React.FC<ContactsProps> = ({ username, me, status, url }) => {

  const [isClicked, setIsClicked] = useState<"send" | "cancel" | "">("");
  const [friendshipState, setFriendshipState] = useState<FriendshipStatus | false>(status);
  
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

  return (
    <div className="flex justify-center gap-4 px-6">
      {!me && friendshipState == false && (
        <button
          onClick={() => {
            setIsClicked("send")
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
