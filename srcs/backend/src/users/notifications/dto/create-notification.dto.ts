import { GAMEHEIGHT } from './../../../game/game.constants';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, RequestStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  read?: boolean;

  @ApiProperty({
    description: 'The type of the notification',
    enum: NotificationType,
    isArray: true,
    example: [
      NotificationType.FRIEND_REQUEST_ACCEPTED,
      NotificationType.FRIEND_REQUEST_SENT,
      NotificationType.GAME_INVITE,
    ],
  })
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
  requestId?: number;

  @IsEnum(RequestStatus)
  @IsOptional()
  requestStatus?: RequestStatus;
}
