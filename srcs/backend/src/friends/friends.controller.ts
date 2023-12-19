import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { QueryDto } from 'src/users/dto/query.dto';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';
import { AuthGuard } from 'src/guards/auth.guard';

// TODO: Put the endpoints related to friends in a /friends route
// TODO: Put the endpoints related to friend requests in a /requests route
// TODO: Put the endpoints related to blocked users in /users/* route
// @UseGuards(AuthGuard)
@Controller()
export class FriendsController {
  private readonly logger = new Logger(FriendsController.name);

  constructor(private readonly friendsService: FriendsService) {}

  // TODO: Change QueryDto to UsernameDto
  @Get()
  list(@Query() query: QueryDto, @User() user: UserType) {
    const { username } = query;

    return this.friendsService.listFriendsByUsername(username || user.username);
  }

  @Get('remove')
  async removeFriend(@Query() query: QueryDto, @User() user: UserType) {
    const { username: friendUsername } = query;

    this.logger.log(
      `User <${user?.username}> is removing user <${friendUsername}> as a friend`,
    );

    return this.friendsService.removeFriend(user.id, friendUsername);
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

  @Get('unblock')
  async unblockUser(@Query() query: QueryDto, @User() user: UserType) {
    const { username: blockedUsername } = query;

    this.logger.log(
      `User <${user?.username}> is unblocking user <${blockedUsername}>`,
    );

    return this.friendsService.unblockUser(user.id, blockedUsername);
  }
}
