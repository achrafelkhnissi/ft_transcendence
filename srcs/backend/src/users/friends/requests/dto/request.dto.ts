import { ApiProperty } from '@nestjs/swagger';
import { FriendRequest, FriendshipStatus } from '@prisma/client';

export class RequestDto implements FriendRequest {
  @ApiProperty()
  id: number;

  @ApiProperty()
  senderId: number;

  @ApiProperty()
  receiverId: number;

  @ApiProperty({
    enum: FriendshipStatus,
  })
  friendshipStatus: FriendshipStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
