import { $Enums, FriendshipStatus, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

// TODO: Make this work
export class UserResponseDto implements User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  url: string;
  status: $Enums.Status;
  experiencePoints: number;
  level: number;
  isFriend: false | FriendshipStatus; // To check if the user is friend with the user making the request
  phoneNumber: string;
  isPhoneNumberVerified: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
