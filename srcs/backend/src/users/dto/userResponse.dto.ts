import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

// TODO: Make this work
export class UserResponseDto implements User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  url: string;
  status: $Enums.Status;
  twoFactorEnabled: boolean;
  experiencePoints: number;
  level: number;

  @Exclude()
  twoFactorSecret: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  friends: number[];

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
