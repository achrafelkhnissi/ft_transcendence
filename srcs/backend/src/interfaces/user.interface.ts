import { $Enums } from '@prisma/client';
import { FriendRequest } from '@prisma/client';

export interface UserType {
  id: number;
  username?: string;
  email: string;
  phoneNumber?: string;
  isPhoneNumberVerified: boolean;
  avatar?: string;
  url: string;
  status?: $Enums.Status;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  experiencePoints: number;
  level: number;
  friendRequestsSent: FriendRequest[];
  friendRequestsReceived: FriendRequest[];
  createdAt: Date;
  updatedAt: Date;
}
