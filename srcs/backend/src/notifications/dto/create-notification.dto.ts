import { NotificationType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  readonly senderUsername: string;

  @IsNotEmpty()
  @IsString()
  readonly senderAvatar: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  read?: boolean;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  @IsString()
  readonly type: NotificationType;

  @IsNotEmpty()
  @IsNumber()
  readonly receiverId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly senderId: number;

  @IsNumber()
  @IsOptional()
  friendRequestId?: number;
}
