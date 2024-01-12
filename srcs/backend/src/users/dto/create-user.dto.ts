import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { User, Status } from '@prisma/client';

// Partial<User> makes all properties optional
export class CreateUserDto implements Readonly<Partial<User>> {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
