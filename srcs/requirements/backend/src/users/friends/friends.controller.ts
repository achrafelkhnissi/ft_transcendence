import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  // @Get('friends/add')
  // async sendFriendRequest(
  //   @Query() query: { username: string },
  //   @User() user: UserType,
  // ) {
  //   const senderId = user?.id;
  //   const receiverUsername = query.username;

  //   this.logger.log(
  //     `User <${user?.username}> is adding user <${receiverUsername}> as a friend`,
  //   );

  //   return this.friendsService.sendFriendRequest(senderId, receiverUsername);
  // }

  // @Get('friends/accept')
  // async acceptFriendRequest(
  //   @Query() query: { username: string },
  //   // @Req() req: Request,
  //   @User() user: UserType,
  // ) {
  //   const senderId = user?.id;
  //   const receiverUsername = query.username;

  //   this.logger.log(
  //     `User <${user?.username}> is accepting a friend request from user <${receiverUsername}>`,
  //   );

  //   return this.friendsService.acceptFriendRequest(senderId, receiverUsername);
  // }

  // @Get('friends/decline')
  // async declineFriendRequest(
  //   @Query() query: { username: string },
  //   // @Req() req: Request,
  //   @User() user: UserType,
  // ) {
  //   const senderId = user?.id;
  //   const receiverUsername = query.username;

  //   this.logger.log(
  //     `User <${user?.username}> is rejecting a friend request from user <${receiverUsername}>`,
  //   );

  //   return this.friendsService.declineFriendRequest(senderId, receiverUsername);
  // }

  // @Post('friends/list')
  // async listFriends(@Body() body: { username: string }) {
  //   this.logger.log(`Listing friends of user <${body.username}>`);
  //   return this.friendsService.listFriendsByIdentifier(body?.username);
  // }

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
