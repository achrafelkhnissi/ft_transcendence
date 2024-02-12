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
  isRead: boolean;
  conversationId: number;
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
}

export type ConversationsMap = {
  [key: number]: Conversation;
};

export interface actionData {
  action: string;
  user: number;
  data: Conversation;
}
