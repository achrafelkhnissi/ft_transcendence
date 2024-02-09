import { ApiProperty } from '@nestjs/swagger';

export class UserFriendResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  status: string;
}
