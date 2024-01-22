import { $Enums, User } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsEnum($Enums.ConversationType)
  @IsNotEmpty()
  type: $Enums.ConversationType;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  password?: string; // TODO: How to make the password required if the chat is protected?

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  ownerId?: number;

  admins: User[]; // TODO: Check if you need/can use UserDto here

  participants: User[];
}
