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
  readonly content: string;

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
  readonly recipientId: number;

  @IsNumber()
  @IsOptional()
  friendRequestId?: number;
}
