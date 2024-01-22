import { $Enums } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// TODO: validate name & image & password
export class CreateChatDto {
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
}
