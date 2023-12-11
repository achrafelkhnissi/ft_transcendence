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


export const messagesProps : Message[] = [
    {
        id: 0,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45pm",
        isRead: false,
    },
    {
        id: 1,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45pm",
        isRead: false,
    },    {
        id: 2,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45pm",
        isRead: false,
    },    {
        id: 3,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45pm",
        isRead: false,
    },    {
        id: 4,
        senderName: "achraf",
        senderProfile: "khasdf",
        senderId: 2,
        content: "hello there!",
        createdAt: "1.45pm",
        isRead: false,
    },
]