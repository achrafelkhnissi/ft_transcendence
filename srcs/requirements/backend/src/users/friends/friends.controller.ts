import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendsService } from './friends.service';

@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('add')
  async addFriend(@Body() body: { username: string }) {
    return this.friendsService.addFriend(body.username);
  }

  @Post('remove')
  async removeFriend(@Body() body: { username: string }) {
    return this.friendsService.removeFriend(body.username);
  }

  @Post('list')
  async listFriends() {
    return this.friendsService.listFriends();
  }

  @Post('requests')
  async listRequests() {
    return this.friendsService.listRequests();
  }

  @Post('accept')
  async acceptRequest(@Body() body: { username: string }) {
    return this.friendsService.acceptRequest(body.username);
  }

  @Post('reject')
  async rejectRequest(@Body() body: { username: string }) {
    return this.friendsService.rejectRequest(body.username);
  }

  @Post('cancel')
  async cancelRequest(@Body() body: { username: string }) {
    return this.friendsService.cancelRequest(body.username);
  }

  @Post('search')
  async searchUser(@Body() body: { username: string }) {
    return this.friendsService.searchUser(body.username);
  }

  @Post('request')
  async requestFriend(@Body() body: { username: string }) {
    return this.friendsService.requestFriend(body.username);
  }

  @Post('block')
  async blockUser(@Body() body: { username: string }) {
    return this.friendsService.blockUser(body.username);
  }

  @Post('unblock')
  async unblockUser(@Body() body: { username: string }) {
    return this.friendsService.unblockUser(body.username);
  }

  @Post('blocklist')
  async listBlockedUsers() {
    return this.friendsService.listBlockedUsers();
  }

  @Post('blocked')
  async isBlocked(@Body() body: { username: string }) {
    return this.friendsService.isBlocked(body.username);
  }

  @Get('non-friends')
  async listNonFriends() {
    return this.friendsService.listNonFriends();
  }
}
