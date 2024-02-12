import { ApiProperty } from '@nestjs/swagger';
import { MuteDuration } from '@prisma/client';

export class MuteDto {
  @ApiProperty({ description: 'The unique identifier for a mute.' })
  id: number;

  @ApiProperty({ description: 'The duration of the mute.', enum: MuteDuration })
  duration: MuteDuration;

  @ApiProperty({ description: 'The identifier of the user who is muted.' })
  userId: number;

  @ApiProperty({
    description: 'The identifier of the conversation where the user is muted.',
  })
  conversationId: number;
}
