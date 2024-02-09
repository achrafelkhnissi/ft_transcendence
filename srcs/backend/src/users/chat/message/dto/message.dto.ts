import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class MessageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  conversationId: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: () => UserDto })
  sender: UserDto;
}
