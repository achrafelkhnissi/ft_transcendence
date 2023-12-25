export type UserStatuses = Record<number, string>; 

export interface User {
    username:  string;
    avatar: string;
    status: string;
}

export interface Message{
    sender : User;
    content: string;
    createdAt: string;
    isRead: boolean;
}

export interface Conversation{
    id: number;
    type: string;
    createdAt: string;
    updatedAt: string;
    participant: User[];
    oweners: User[];
    admins: User[];
    messages: Message[];
}

export type ConversationsMap = {
    [key: number]: Conversation;
  };
  
// export const messagesProps : Message[] = [
//     {
//         id: 0,
//         senderName: "achraf",
//         senderProfile: "khasdf",
//         senderId: 2,
//         content: "hello there!",
//         createdAt: "1.45 PM",
//         isRead: false,
//     },
//     {
//         id: 1,
//         senderName: "achraf",
//         senderProfile: "khasdf",
//         senderId: 2,
//         content: "hello there!",
//         createdAt: "1.45 PM",
//         isRead: false,
//     },    {
//         id: 2,
//         senderName: "achraf",
//         senderProfile: "khasdf",
//         senderId: 2,
//         content: "hello there!",
//         createdAt: "1.45 PM",
//         isRead: false,
//     },    {
//         id: 3,
//         senderName: "achraf",
//         senderProfile: "khasdf",
//         senderId: 2,
//         content: "hello there!",
//         createdAt: "1.45 PM",
//         isRead: false,
//     },    {
//         id: 4,
//         senderName: "achraf",
//         senderProfile: "khasdf",
//         senderId: 2,
//         content: "hello there!",
//         createdAt: "1.45 PM",
//         isRead: false,
//     },
//    {
//         id: 4,
//         senderName: "achraf",
//         senderProfile: "khasdf",
//         senderId: 2,
//         content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio praesentium cum, et ipsum ea tempore, suscipit qui minima modi eveniet dolore, porro ratione dolores fugit quo fuga! Explicabo, fugit molestiae?",
//         createdAt: "1.45 PM",
//         isRead: false,
//     },
// ]

// export const conversationProps : Conversation[] = [
//     {
//         id: 0,
//         createdAt: "1.30 am",
//         updatedAt: "1.30 am",
//         participant: "me",
//         messages: messagesProps,
//     },  {
//         id: 0,
//         createdAt: "1.30 am",
//         updatedAt: "1.30 am",
//         participant: "me",
//         messages: messagesProps,
//     },  {
//         id: 0,
//         createdAt: "1.30 am",
//         updatedAt: "1.30 am",
//         participant: "me",
//         messages: messagesProps,
//     },  {
//         id: 0,
//         createdAt: "1.30 am",
//         updatedAt: "1.30 am",
//         participant: "me",
//         messages: messagesProps,
//     },    {
//         id: 0,
//         createdAt: "1.30 am",
//         updatedAt: "1.30 am",
//         participant: "me",
//         messages: messagesProps,
//     },  {
//         id: 0,
//         createdAt: "1.30 am",
//         updatedAt: "1.30 am",
//         participant: "me",
//         messages: messagesProps,
//     },  {
//         id: 0,
//         createdAt: "1.30 am",
//         updatedAt: "1.30 am",
//         participant: "me",
//         messages: messagesProps,
//     },  {
//         id: 0,
//         createdAt: "1.30 am",
//         updatedAt: "1.30 am",
//         participant: "me",
//         messages: messagesProps,
//     },
// ]