import {
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  conversationId: number;
}
