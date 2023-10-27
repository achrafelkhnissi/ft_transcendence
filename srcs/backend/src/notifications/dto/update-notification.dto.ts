import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { NotificationType } from '@prisma/client';

function toBoolean(value: string): boolean {
  value = value.toLowerCase();

  return value === 'true' || value === '1'
    ? true
    : value === 'false' || value === '0'
    ? false
    : null;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  read?: boolean;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  readonly recipientId?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  readonly friendRequestId?: number;

  @IsEnum(NotificationType)
  @IsOptional()
  readonly type?: NotificationType;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  readonly id?: number;
}
