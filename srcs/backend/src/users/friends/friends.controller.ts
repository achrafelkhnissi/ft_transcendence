import {
  Controller,
  Get,
  Logger,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserFriendResponseDto } from './dto/user-friend-response.dto';
import { Gateway } from 'src/gateway/gateway';

@ApiTags('friends')
@UseGuards(AuthGuard)
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller()
export class FriendsController {
  private readonly logger = new Logger(FriendsController.name);

  constructor(
    private readonly friendsService: FriendsService,
    private readonly gateway: Gateway,
  ) {}

  @ApiQuery({
    name: 'id',
    type: Number,
    required: false,
    description: 'User id',
  })
  @ApiOkResponse({
    type: [UserFriendResponseDto],
    description: 'The user has been successfully found.',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiOperation({
    summary:
      'List a user friends if id is provided, otherwise list the current user friends',
  })
  @Get()
  list(@Query('id', new ParseIntPipe()) id: number, @User() user: UserType) {
    return this.friendsService.listFriendsById(id || user.id);
  }

  @ApiQuery({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOkResponse({
    description: 'The user has been successfully found.',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiOperation({ summary: 'Remove a friend' })
  @Get('remove')
  async removeFriend(
    @Query('id', new ParseIntPipe()) id: number,
    @User() user: UserType,
  ) {
    const request = await this.friendsService.removeFriend(user.id, id);

    if (request) {
      this.gateway.server.to(`user-${id}`).emit('friend-removed', { request });
    }

    return request;
  }

  @Get('blocked')
  @ApiOkResponse({
    type: [UserFriendResponseDto],
    description: 'The blocked users have been successfully found.',
  })
  @ApiOperation({ summary: 'List blocked users' })
  async listBlockedUsers(@User() user: UserType) {
    this.logger.log(`Listing blocked users for user <${user?.id}>`);
    return this.friendsService.listBlockedUsers(user.id);
  }

  @ApiQuery({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOkResponse({
    description: 'The user has been successfully blocked.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiOperation({ summary: 'Block a user' })
  @Get('block')
  async blockUser(
    @Query('id', new ParseIntPipe()) id: number,
    @User() user: UserType,
  ) {
    this.logger.log(`User <${user?.id}> is blocking user <${id}>`);

    const request = await this.friendsService.blockUser(user.id, id);

    if (request) {
      const ids = [user.id, id].sort((a, b) => a - b);
      const roomName = `Room-${ids[0]}-${ids[1]}`;
      this.gateway.server.to(`user-${id}`).emit('blocked', {
        senderId: user.id,
        receiverId: id,
        roomName,
      });
    }

    return request;
  }

  @ApiQuery({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOkResponse({
    description: 'The user has been successfully unblocked.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiOperation({ summary: 'Unblock a user' })
  @Get('unblock')
  async unblockUser(
    @Query('id', ParseIntPipe) id: number,
    @User() user: UserType,
  ) {
    this.logger.log(`User <${user?.id}> is unblocking user <${id}>`);

    return this.friendsService.unblockUser(user.id, id);
  }
}
