import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MuteDuration } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class MuteDto {
  @ApiProperty({ description: 'The unique identifier for a mute.' })
  @ApiPropertyOptional()
  @IsOptional()
  id: number;

  @ApiProperty({ description: 'The duration of the mute.', enum: MuteDuration })
  @IsNotEmpty()
  @IsEnum(MuteDuration)
  duration: MuteDuration;

  @ApiProperty({ description: 'The identifier of the user who is muted.' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'The identifier of the conversation where the user is muted.',
  })
  @ApiPropertyOptional()
  conversationId?: number;

  @ApiProperty({ description: 'The date when the mute was created.' })
  @ApiPropertyOptional()
  createdAt?: Date;
}
