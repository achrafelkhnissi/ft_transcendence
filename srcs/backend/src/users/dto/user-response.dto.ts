import { $Enums } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { Status } from 'src/common/enums/status.enum';
import { FriendshipStatus } from 'src/common/enums/friendRequestStatus.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { SettingsDto } from './settings.dto';

export class UserResponseDto {
  @ApiProperty({ description: 'The ID of the user' })
  id: number;

  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @ApiProperty({ description: 'The avatar of the user' })
  avatar: string;

  @ApiProperty({ description: 'The URL of the user' })
  url: string;

  @ApiProperty({ description: 'The status of the user', enum: Status })
  status: $Enums.Status;

  @ApiProperty({
    description:
      'The friendship status with the user making the request, either false or a FriendshipStatus enum',
    enum: FriendshipStatus,
  })
  isFriend: false | $Enums.FriendshipStatus;

  @ApiProperty({ description: 'The phone number of the user' })
  phoneNumber: string;

  settings: SettingsDto;
  friends: UserDto[];
  blockedUsers: UserDto[];
}
