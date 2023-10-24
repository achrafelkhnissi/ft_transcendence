import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { QueryDto } from '../dto/query.dto';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller() // friends is the default route
export class FriendsController {
  private readonly logger = new Logger(FriendsController.name);

  constructor(private readonly friendsService: FriendsService) {}

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

  // // TODO: Test this after merging with the frontend
  // // If it works, remove the other listFriends route
  // @Get('friends/list')
  // async listFriends2(@User() user: UserType) {
  //   this.logger.log(`Listing friends of user <${user?.username}>`);
  //   return this.friendsService.listFriendsByIdentifier(user?.username);
  // }

  // @Get('friends/remove')
  // async removeFriend(
  //   @Query() query: { username: string },
  //   // @Req() req: Request,
  //   @User() user: UserType,
  // ) {
  //   const userId = user?.id;
  //   const friendUsername = query.username;

  //   this.logger.log(
  //     `User <${user?.username}> is removing user <${friendUsername}> as a friend`,
  //   );

  //   return this.friendsService.removeFriend(userId, friendUsername);
  // }
}
