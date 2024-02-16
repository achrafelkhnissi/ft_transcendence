import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsArray()
  readBy?: number[];

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
