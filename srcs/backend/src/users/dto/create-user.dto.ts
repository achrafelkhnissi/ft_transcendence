import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { User, Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { SettingsDto } from './settings.dto';
import { Type } from 'class-transformer';

// Partial<User> makes all properties optional
export class CreateUserDto implements Readonly<Partial<User>> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty({
    enum: Status,
    description: 'User status',
    required: false,
    example: Status.ONLINE,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SettingsDto)
  @IsOptional()
  settings?: SettingsDto;
}
