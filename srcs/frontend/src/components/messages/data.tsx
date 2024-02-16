export type UserStatuses = Record<number, string>;

export interface User {
  username: string;
  avatar: string;
  status: string;
  id?: number;
}

export interface Message {
  sender: User;
  receiver: User;
  content: string;
  createdAt: string;
  readdBy: number[];
  conversationId: number;
}

export interface Mute {
  user: User;
  duration: 'HOUR' | 'DAY' | 'MINUTE' ;
  createdAt: string;
}

export interface Conversation {
  id: number;
  type: string;
  password: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  participants: User[];
  owner: User;
  admins: User[];
  messages: Message[];
  image: string;
  bannedUsers: User[];
  mutedUsers: Mute[];
}

export type ConversationsMap = {
  [key: number]: Conversation;
};

export interface actionData {
  action: string;
  user: number;
  data: Conversation;
}
