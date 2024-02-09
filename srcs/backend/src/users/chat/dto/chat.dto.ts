import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';
import { MessageDto } from 'src/users/chat/message/dto/message.dto';

export class ConversationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ type: () => UserDto, nullable: true })
  owner: UserDto | null;

  @ApiProperty({ type: () => [UserDto] })
  participants: UserDto[];

  @ApiProperty({ type: () => [UserDto] })
  admins: UserDto[];

  @ApiProperty({ type: () => [MessageDto] })
  messages: MessageDto[];
}
