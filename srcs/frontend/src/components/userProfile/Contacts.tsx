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
  stats: false | FriendshipStatus;
  isClicked: "send" | "cancel" | "friend" | "";
}

const Contacts: React.FC<ContactsProps> = ({ username, me, status, url }) => {
  const [state, setState] = useState<statePorps>({
    stats: status,
    isClicked: "",
  });

  useEffect(() => {
    if (state.isClicked == "send") {
      sendFriendRequest(username).then((res) => {
        setState({
          isClicked: "",
          stats: res.request.friendshipStatus,
        });
      });
    }
  }, [state, username]);

  return (
    <div className="flex justify-center gap-4 px-6">
      {!me && state.stats == false && (
        <button
          onClick={() => {
            setState({
              stats: status,
              isClicked: "send",
            });
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
      {!me && state.stats == FriendshipStatus.PENDING && (
        <button
          onClick={() => {
            setState((prev) => ({
              stats: prev.stats,
              isClicked: "cancel",
            }));
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

//   return (
//     <div className="flex justify-center gap-4 px-6">
//       {ContactsItems.map((item, index) => {
//         if (
//           !me &&
//           (item.label == "send message" ||
//             (item.label == "add friend" && status === false) ||
//             (item.label == "cancel request" &&
//               status === FriendshipStatus.PENDING) ||
//             (item.label == "friend" && status == FriendshipStatus.ACCEPTED))
//         )
//           return (
//             <button
//               key={index}
//               onClick={(e) => {
//                 if (item.label == "add friend") {
//                   e.preventDefault();
//                   sendFriendRequest(username);
//                 } else if (item.label == "cancel request") {
//                   e.preventDefault();
//                   cancelFriendRequest(username);
//                 } else if (item.label == "friend") {
//                   e.preventDefault();
//                   removeFriend(username);
//                 }
//               }}
//               className={`
//               rounded-xl
//               bg-[${item.color}]
//               p-2
//               `}
//             >
//               {item.icon}
//             </button>
//           );
//       })}
//       <Link
//         target="_blank"
//         href={url}
//         className={`
//                                 rounded-xl
//                                 bg-[#6257FE]
//                                 p-2
//                                 `}
//       >
//         <Logo_42 color="white" width="1.7rem" height="1.5rem" />{" "}
//       </Link>
//     </div>
//   );
