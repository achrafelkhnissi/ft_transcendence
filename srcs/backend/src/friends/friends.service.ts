import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FriendshipStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async listFriendsByUsername(username: string) {
    this.logger.debug(`Listing friends for user <${username}>`);
    const user = await this.prisma.user.findUnique({
      where: { username: username },
      include: {
        friendRequestsSent: {
          where: {
            friendshipStatus: FriendshipStatus.ACCEPTED,
          },
          include: {
            receiver: {
              select: {
                username: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
        friendRequestsReceived: {
          where: {
            friendshipStatus: FriendshipStatus.ACCEPTED,
          },
          include: {
            sender: {
              select: {
                username: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User <${username}> not found`);
    }

    const friends = [
      ...user.friendRequestsSent.map((friendRequest) => friendRequest.receiver),
      ...user.friendRequestsReceived.map(
        (friendRequest) => friendRequest.sender,
      ),
    ];

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
        AND: [
          { senderId: { equals: userId } },
          { friendshipStatus: { equals: FriendshipStatus.BLOCKED } },
        ],
      },
      select: {
        receiver: {
          select: {
            username: true,
            avatar: true,
            status: true,
          },
        },
      },
    });

    const blockedUsers = friendRequests.map(
      (friendRequest) => friendRequest.receiver,
    );

    return blockedUsers;
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
      select: {
        id: true,
        friendshipStatus: true,
      },
    });

    if (!friendRequest) {
      const newRequest = await this.prisma.friendRequest.create({
        data: {
          senderId: userId, // To mark who blocked who, we need to update the senderId and receiverId
          receiverId: friend.id,
          friendshipStatus: FriendshipStatus.BLOCKED,
        },
      });

      return { message: 'User blocked', newRequest };
    }

    if (friendRequest.friendshipStatus === FriendshipStatus.BLOCKED) {
      throw new BadRequestException(
        `Friend request from <${friendUsername}> to <${userId}> not found or already blocked`,
      );
    }

    const updatedRequest = await this.prisma.friendRequest.update({
      where: {
        id: friendRequest.id,
      },
      data: {
        //To mark who blocked who, we need to update the senderId and receiverId
        senderId: userId,
        receiverId: friend.id,
        friendshipStatus: FriendshipStatus.BLOCKED,
      },
    });

    return { message: 'User blocked', updatedRequest };
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
}
