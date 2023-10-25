import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { QueryDto } from '../dto/query.dto';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class FriendsController {
  private readonly logger = new Logger(FriendsController.name);

  constructor(private readonly friendsService: FriendsService) {}

  // TODO: Change QueryDto to UsernameDto

  @Get()
  list(@Query() query: QueryDto, @User() user: UserType) {
    const { username, id } = query;
    const identifier = username || id || user?.username;
    return this.friendsService.listFriendsByIdentifier(identifier);
  }

  // TODO: Adding an existing friend should return an error
  @Get('add')
  async sendFriendRequest(@Query() query: QueryDto, @User() user: UserType) {
    const senderId = user?.id;
    const { username: receiverUsername } = query;

    this.logger.log(
      `User <${user?.username}> is adding user ${receiverUsername} as a friend`,
    );

    return this.friendsService.sendFriendRequest(senderId, receiverUsername);
  }

  @Get('accept')
  async acceptFriendRequest(@Query() query: QueryDto, @User() user: UserType) {
    const { username: senderUsername } = query;
    const receiverId = user?.id;

    this.logger.log(
      `User <${user?.username}> is accepting a friend request from user <${receiverId}>`,
    );

    return this.friendsService.acceptFriendRequest(receiverId, senderUsername);
  }

  @Get('decline')
  async declineFriendRequest(@Query() query: QueryDto, @User() user: UserType) {
    const { username: senderUsername } = query;
    const receiverId = user?.id;

    this.logger.log(
      `User <${user?.username}> is declining a friend request from user <${receiverId}>`,
    );

    return this.friendsService.declineFriendRequest(receiverId, senderUsername);
  }

  @Get('unfriend')
  async removeFriend(@Query() query: QueryDto, @User() user: UserType) {
    const { username: friendUsername } = query;

    this.logger.log(
      `User <${user?.username}> is removing user <${friendUsername}> as a friend`,
    );

    return this.friendsService.removeFriend(user.id, friendUsername);
  }

  @Get('requests/sent')
  async listSentFriendRequests(@User() user: UserType) {
    this.logger.log(`Listing sent friend requests for user <${user?.id}>`);
    return this.friendsService.listSentFriendRequests(user.id);
  }

  @Get('requests/received')
  async listReceivedFriendRequests(@User() user: UserType) {
    this.logger.log(`Listing received friend requests for user <${user?.id}>`);
    return this.friendsService.listReceivedFriendRequests(user.id);
  }

  @Get('blocked')
  async listBlockedUsers(@User() user: UserType) {
    this.logger.log(`Listing blocked users for user <${user?.id}>`);
    return this.friendsService.listBlockedUsers(user.id);
  }

  @Get('block')
  async blockUser(@Query() query: QueryDto, @User() user: UserType) {
    const { username: blockedUsername } = query;

    this.logger.log(
      `User <${user?.username}> is blocking user <${blockedUsername}>`,
    );

    return this.friendsService.blockUser(user.id, blockedUsername);
  }

  // TODO: Check the bellow endpoints for unseen errors;
  @Get('unblock')
  async unblockUser(@Query() query: QueryDto, @User() user: UserType) {
    const { username: blockedUsername } = query;

    this.logger.log(
      `User <${user?.username}> is unblocking user <${blockedUsername}>`,
    );

    return this.friendsService.unblockUser(user.id, blockedUsername);
  }

  @Get('requests')
  async listFriendRequests(@User() user: UserType) {
    this.logger.log(`Listing friend requests for user <${user?.id}>`);
    return this.friendsService.listFriendRequests(user.id);
  }

  @Get('cancel')
  async cancelFriendRequest(@Query() query: QueryDto, @User() user: UserType) {
    const { username: receiverUsername } = query;
    const senderId = user?.id;

    this.logger.log(
      `User <${user?.username}> is cancelling a friend request to user <${receiverUsername}>`,
    );

    return this.friendsService.cancelFriendRequest(senderId, receiverUsername);
  }
}
