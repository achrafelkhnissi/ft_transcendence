import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  room?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  conversationId: number;
}
