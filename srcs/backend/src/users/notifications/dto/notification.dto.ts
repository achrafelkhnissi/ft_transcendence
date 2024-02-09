import { ApiProperty } from '@nestjs/swagger';

export class SenderDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatar: string;
}

export class NotificationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  type: string;

  @ApiProperty({ type: () => SenderDto })
  sender: SenderDto;
}
