import { Controller, Get, Query, Logger, UseGuards } from '@nestjs/common';
import { FriendRequestsService } from './requests.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { QueryDto } from 'src/users/dto/query.dto';
import { ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('friend-requests')
@ApiForbiddenResponse({ description: 'Forbidden' })
@UseGuards(AuthGuard)
@Controller()
export class FriendRequestsController {
  private readonly logger = new Logger(FriendRequestsController.name);

  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @ApiOperation({
    summary: 'Send a friend request to another user',
  })
  @Get('send')
  async sendFriendRequest(@Query() query: QueryDto, @User() user: UserType) {
    const senderId = user?.id;
    const { username: receiverUsername } = query;

    this.logger.log(
      `User <${user?.username}> is adding user ${receiverUsername} as a friend`,
    );

    return this.friendRequestsService.sendFriendRequest(
      senderId,
      receiverUsername,
    );
  }

  @ApiOperation({
    summary: 'Accept a friend request from another user',
  })
  @Get('accept')
  async acceptFriendRequest(@Query() query: QueryDto, @User() user: UserType) {
    const { username: senderUsername } = query;
    const receiverId = user?.id;

    this.logger.log(
      `User <${user?.username}> is accepting a friend request from user <${receiverId}>`,
    );

    return this.friendRequestsService.acceptFriendRequest(
      receiverId,
      senderUsername,
    );
  }

  @ApiOperation({
    summary: 'Decline a friend request from another user',
  })
  @Get('decline')
  async declineFriendRequest(@Query() query: QueryDto, @User() user: UserType) {
    const { username: senderUsername } = query;
    const receiverId = user?.id;

    this.logger.log(
      `User <${user?.username}> is declining a friend request from user <${receiverId}>`,
    );

    return this.friendRequestsService.declineFriendRequest(
      receiverId,
      senderUsername,
    );
  }

  @ApiOperation({
    summary: 'List sent friend requests',
  })
  @Get('sent')
  async listSentFriendRequests(@User() user: UserType) {
    this.logger.log(`Listing sent friend requests for user <${user?.id}>`);
    return this.friendRequestsService.listSentFriendRequests(user.id);
  }

  @ApiOperation({
    summary: 'List received friend requests',
  })
  @Get('received')
  async listReceivedFriendRequests(@User() user: UserType) {
    this.logger.log(`Listing received friend requests for user <${user?.id}>`);
    return this.friendRequestsService.listReceivedFriendRequests(user.id);
  }

  @ApiOperation({
    summary: 'Cancel a friend request sent to another user',
  })
  @Get('cancel')
  async cancelFriendRequest(@Query() query: QueryDto, @User() user: UserType) {
    const { username: receiverUsername } = query;
    const senderId = user?.id;

    this.logger.log(
      `User <${user?.username}> is cancelling a friend request to user <${receiverUsername}>`,
    );

    return this.friendRequestsService.cancelFriendRequest(
      senderId,
      receiverUsername,
    );
  }
}
