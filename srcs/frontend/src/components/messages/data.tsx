export type UserStatuses = Record<number, string>; 

export interface Message{
    id: number;
    senderName: string;
    senderProfile: string;
    senderId: number;
    content: string;
    createdAt: string;
    isRead: boolean;
}

export interface Conversation{
    id: number;
    createdAt: string;
    updatedAt: string;
    participant: string;
    messages: Message[];
}

export const messagesProps : Message[] = [
    {
        id: 0,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45 PM",
        isRead: false,
    },
    {
        id: 1,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45 PM",
        isRead: false,
    },    {
        id: 2,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45 PM",
        isRead: false,
    },    {
        id: 3,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45 PM",
        isRead: false,
    },    {
        id: 4,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45 PM",
        isRead: false,
    },
   {
        id: 4,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio praesentium cum, et ipsum ea tempore, suscipit qui minima modi eveniet dolore, porro ratione dolores fugit quo fuga! Explicabo, fugit molestiae?",
        createdAt: "1.45 PM",
        isRead: false,
    },
]

export const conversationProps : Conversation[] = [
    {
        id: 0,
        createdAt: "1.30 am",
        updatedAt: "1.30 am",
        participant: "me",
        messages: messagesProps,
    },  {
        id: 0,
        createdAt: "1.30 am",
        updatedAt: "1.30 am",
        participant: "me",
        messages: messagesProps,
    },  {
        id: 0,
        createdAt: "1.30 am",
        updatedAt: "1.30 am",
        participant: "me",
        messages: messagesProps,
    },  {
        id: 0,
        createdAt: "1.30 am",
        updatedAt: "1.30 am",
        participant: "me",
        messages: messagesProps,
    },    {
        id: 0,
        createdAt: "1.30 am",
        updatedAt: "1.30 am",
        participant: "me",
        messages: messagesProps,
    },  {
        id: 0,
        createdAt: "1.30 am",
        updatedAt: "1.30 am",
        participant: "me",
        messages: messagesProps,
    },  {
        id: 0,
        createdAt: "1.30 am",
        updatedAt: "1.30 am",
        participant: "me",
        messages: messagesProps,
    },  {
        id: 0,
        createdAt: "1.30 am",
        updatedAt: "1.30 am",
        participant: "me",
        messages: messagesProps,
    },
]