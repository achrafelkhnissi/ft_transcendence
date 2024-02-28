import { FriendsService } from './../../friends/friends.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { MessageService } from './message.service';
import { User } from 'src/common/decorators/user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { Gateway } from 'src/gateway/gateway';
import { UserType } from 'src/common/interfaces/user.interface';

@UseGuards(AuthGuard)
@ApiTags('message')
@Controller()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly friendsService: FriendsService,
    private readonly gateway: Gateway,
  ) {}

  @Post()
  @ApiBody({ type: CreateMessageDto })
  @ApiCreatedResponse({
    description: 'The message has been successfully created.',
    type: CreateMessageDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiOperation({ summary: 'Create a new message.' })
  async create(
    @User('id', ParseIntPipe) userId: number,
    @Body() message: CreateMessageDto,
  ) {
    const { room } = message;

    const msg = await this.messageService.create({
      ...message,
      senderId: userId,
    });

    if (msg) {
      const blockedUsersRoomName = `user-${userId}-blocked-users`;

      const blockedUsers = await this.friendsService.getBlockedUsersIds(userId);
      blockedUsers.forEach((blockedUserId) => {
        const sockets = this.gateway.server.sockets.adapter.rooms.get(
          `user-${blockedUserId}`,
        );
        sockets.forEach((socketId) => {
          this.gateway.server.sockets.sockets
            .get(socketId)
            .join(blockedUsersRoomName);
        });
      });

      this.gateway.server
        .to(room)
        .except(blockedUsersRoomName)
        .emit('onMessage', msg);
    }
    return msg;
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'The message has been successfully marked as read.',
  })
  @ApiNotFoundResponse({ description: 'Message not found.' })
  @ApiOperation({ summary: 'Mark a message as read.' })
  async read(@Param('id', ParseIntPipe) id: number, @User() user: UserType) {
    const message = await this.messageService.findOne(id);

    if (message.senderId === user.id || message.readBy.includes(user.id)) {
      return message;
    }

    return this.messageService.update(id, {
      readBy: message.readBy ? [...message.readBy, user.id] : [user.id],
    });
  }
}
