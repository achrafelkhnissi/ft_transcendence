import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User, FriendshipStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService, //TODO: Change it to friendRequestService (maybe?)
  ) {}

  async listFriendsByIdentifier(id: string | number): Promise<User[]> {
    const user: User =
      typeof id === 'string'
        ? await this.usersService.findByUsername(id)
        : await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException(`User with identifier <${id}> not found`);
    }

    const acceptedFriendRequests = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            senderId: { equals: user.id },
            friendshipStatus: FriendshipStatus.ACCEPTED,
          },
          {
            receiverId: { equals: user.id },
            friendshipStatus: FriendshipStatus.ACCEPTED,
          },
        ],
      },
    });

    if (!acceptedFriendRequests) {
      return [];
    }

    const friendIds = acceptedFriendRequests.map((friendRequest) => {
      return friendRequest.senderId === user.id
        ? friendRequest.receiverId
        : friendRequest.senderId;
    });

    const friends = await this.prisma.user.findMany({
      where: { id: { in: friendIds } },
    });

    return friends;
  }

  async removeFriend(userId: number, friendUsername: string) {
    this.logger.log(
      `Removing friend <${friendUsername}> from user <${userId}>`,
    );

    const friend = await this.prisma.user.findUnique({
      where: { username: friendUsername },
    });

    if (!friend) {
      throw new NotFoundException(`User <${friendUsername}> not found`);
    }

    console.log({
      friend,
    });

    const friendRequests = await this.prisma.friendRequest.deleteMany({
      where: {
        AND: [
          {
            OR: [
              {
                senderId: { equals: userId },
                receiverId: { equals: friend.id },
              },
              {
                senderId: { equals: friend.id },
                receiverId: { equals: userId },
              },
            ],
          },
          {
            friendshipStatus: { equals: FriendshipStatus.ACCEPTED },
          },
        ],
      },
    });

    return { message: 'Friend removed', friendRequests };
  }

  async listBlockedUsers(userId: number) {
    this.logger.log(`Listing blocked users for user <${userId}>`);
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        senderId: { equals: userId },
        friendshipStatus: { equals: FriendshipStatus.BLOCKED },
      },
    });

    return friendRequests;
  }

  async blockUser(userId: number, friendUsername: string) {
    this.logger.log(`Blocking user <${friendUsername}> for user <${userId}>`);
    const friend = await this.prisma.user.findUnique({
      where: { username: friendUsername },
    });

    if (!friend) {
      throw new NotFoundException(`User <${friendUsername}> not found`);
    }

    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: { equals: userId }, receiverId: { equals: friend.id } },
          { senderId: { equals: friend.id }, receiverId: { equals: userId } },
        ],
      },
    });

    if (!friendRequest) {
      return await this.prisma.friendRequest.create({
        data: {
          senderId: userId,
          receiverId: friend.id,
          friendshipStatus: FriendshipStatus.BLOCKED,
        },
      });
    }

    if (friendRequest.friendshipStatus === FriendshipStatus.BLOCKED) {
      throw new BadRequestException(
        `Friend request from <${friendUsername}> to <${userId}> not found or already blocked`,
      );
    }

    const request = await this.prisma.friendRequest.update({
      where: {
        // Maybe adding id field to friendRequest will make this easier, but then we need to remove the unique constraint on senderId_receiverId
        // senderId_receiverId: { senderId: friend.id, receiverId: userId },
        id: friendRequest.id,
      },
      data: {
        //To mark who blocked who, we need to update the senderId and receiverId
        senderId: userId,
        receiverId: friend.id,
        friendshipStatus: FriendshipStatus.BLOCKED,
      },
    });

    return { message: 'User blocked', request };
  }

  async unblockUser(userId: number, friendUsername: string) {
    this.logger.log(`Unblocking user <${friendUsername}> for user <${userId}>`);
    const friend = await this.prisma.user.findUnique({
      where: { username: friendUsername },
    });

    if (!friend) {
      throw new NotFoundException(`User <${friendUsername}> not found`);
    }

    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: { senderId: friend.id, receiverId: userId },
      },
    });

    if (!friendRequest) {
      throw new NotFoundException(
        `Friend request from <${friendUsername}> to <${userId}> not found`,
      );
    }

    if (friendRequest.friendshipStatus !== FriendshipStatus.BLOCKED) {
      throw new BadRequestException(
        `Friend request from <${friendUsername}> to <${userId}> not found`,
      );
    }

    const request = await this.prisma.friendRequest.update({
      where: {
        senderId_receiverId: { senderId: friend.id, receiverId: userId },
      },
      data: {
        friendshipStatus: FriendshipStatus.PENDING,
      },
    });

    return { message: 'User unblocked', request };
  }

  async listFriends(userId: number) {
    this.logger.log(`Listing friends for user <${userId}>`);
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        AND: [
          {
            OR: [
              { senderId: { equals: userId } },
              { receiverId: { equals: userId } },
            ],
          },
          { friendshipStatus: { equals: FriendshipStatus.ACCEPTED } },
        ],
      },
    });

    return friendRequests;
  }
}
