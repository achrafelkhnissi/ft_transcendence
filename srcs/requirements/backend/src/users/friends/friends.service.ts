import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class FriendsService {
  constructor(private readonly usersService: UsersService) {}

  async addFriend(username: string) {
    return { message: 'This action adds a new friend' };
  }

  async removeFriend(username: string) {
    return { message: 'This action removes a friend' };
  }

  async listFriends() {
    return { message: 'This action lists all friends' };
  }

  async listRequests() {
    return { message: 'This action lists all requests' };
  }

  async acceptRequest(username: string) {
    return { message: 'This action accepts a request' };
  }

  async rejectRequest(username: string) {
    return { message: 'This action rejects a request' };
  }

  async cancelRequest(username: string) {
    return { message: 'This action cancels a request' };
  }

  async searchUser(username: string) {
    return { message: 'This action searches a user' };
  }

  async requestFriend(username: string) {
    return { message: 'This action requests a friend' };
  }

  async blockUser(username: string) {
    return { message: 'This action blocks a user' };
  }

  async unblockUser(username: string) {
    return { message: 'This action unblocks a user' };
  }

  async blocklist() {
    return { message: 'This action lists all blocked users' };
  }

  async isBlocked(username: string) {
    return { message: 'This action checks if a user is blocked' };
  }

  async listBlockedUsers() {
    return { message: 'This action lists all blocked users' };
  }

  async listNonFriends() {
    return { message: 'This action lists all non-friends' };
  }
}
