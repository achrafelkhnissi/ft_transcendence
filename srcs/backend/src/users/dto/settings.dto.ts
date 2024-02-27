import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class SettingsDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  verified?: boolean;
}
