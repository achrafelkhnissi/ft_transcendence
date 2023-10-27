import { $Enums } from '@prisma/client';
import { User } from '@prisma/client';

export interface FriendRequestType {
  friendshipStatus: $Enums.FriendshipStatus;
  senderId: number;
  user: User;
  receiverId: number;
  friend: User;
  createdAt: Date;
  updatedAt: Date;
}
