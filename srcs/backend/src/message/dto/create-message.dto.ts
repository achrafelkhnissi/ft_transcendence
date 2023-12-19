// create-message.dto.ts
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  chatId: number;

  @IsInt()
  @IsNotEmpty()
  senderId: number;

  @IsInt()
  @IsNotEmpty()
  receiverId: number;
}
