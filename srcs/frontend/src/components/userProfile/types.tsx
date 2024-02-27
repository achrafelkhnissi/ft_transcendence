import { BiUserCheck, BiUserX, BiUserPlus } from 'react-icons/bi';
import { TbMessageCircle2Filled } from 'react-icons/tb';
import { TiUserAdd } from 'react-icons/ti';
import Logo_42 from '../logos/Logo_42';

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  BLOCKED = 'BLOCKED',
}

export interface FriendsProps {
  id: number;
  username: string;
  avatar: string;
  status: string;
}

export interface BlockedProps {
  sender: {
    id: number;
    username: string;
  };
  receiver: {
    id: number;
    username: string;
  };
}

export interface GameHistoryProps {
  id: number;
  winner: {
    id: number;
    username: string;
  };
  loser: {
    id: number;
    username: string;
  };
  score: string;
}

export interface Achievement {
  name: string;
  description: string;
}

export interface User {
  id: number | null;
  username: string;
  url: string;
  stats: {
    exp: number;
    level: number;
    wins: number;
    losses: number;
  };
  me: boolean;
  isFriend: false | FriendshipStatus;
  friends: FriendsProps[];
  games: GameHistoryProps[];
  blockedUsers? : BlockedProps[];
  achievements?: Achievement[];
}

export const defaultInfos: User = {
  id: null,
  username: '',
  url: '',
  stats: {
    exp: 0,
    level: 0,
    wins: 0,
    losses: 0,
  },
  me: true,
  isFriend: false,
  friends: [],
  games: [],
  blockedUsers: [],
};

export interface ContactsItemsProps {
  label: string;
  href: string;
  color: string;
  icon: React.ReactNode;
}

export const ContactsItems: { [key: string]: ContactsItemsProps } = {
  sendMessage: {
    label: 'send a message',
    href: '/conversation',
    color: '#31A350',
    icon: (
      <TbMessageCircle2Filled className="text-white w-6 h-6 bg-[#31A350]" />
    ),
  },
  sendRequest: {
    label: 'send a friend request',
    href: '/friend-request',
    color: '#3385FF',
    icon: <BiUserPlus className="text-white w-6 h-6 bg-[#3385FF]" />,
  },
  cancelRequest: {
    label: 'cancel friend request',
    href: '/friend-request',
    color: '#3385FF',
    icon: <BiUserX className="text-white w-6 h-6 bg-[#3385FF]" />,
  },
  acceptRequest: {
    label: 'accept friend request',
    href: '/friend-request',
    color: '#3385FF',
    icon: <BiUserCheck className="text-white w-6 h-6 bg-[#3385FF]" />,
  },
  intra: {
    label: 'intra profile ',
    href: '/profile-intra',
    color: '#6257FE',
    icon: <Logo_42 color="white" width="1.7rem" height="1.5rem" />,
  },
};

export interface statePorps {
  isClicked: 'send' | 'cancel' | 'friend' | '';
}
