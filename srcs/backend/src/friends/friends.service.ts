import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FriendshipStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async listFriendsByUsername(username: string) {
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
    this.logger.log(
      `Attempting to block user '${friendUsername}' for user ID ${userId}`,
    );

    const friend = await this.prisma.user.findUnique({
      where: { username: friendUsername },
    });

    if (!friend) {
      throw new NotFoundException(`User '${friendUsername}' not found.`);
    }

    return this.prisma.friendRequest.upsert({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: friend.id,
        },
      },
      update: {
        senderId: userId,
        receiverId: friend.id,
        friendshipStatus: FriendshipStatus.BLOCKED,
      },
      create: {
        senderId: userId,
        receiverId: friend.id,
        friendshipStatus: FriendshipStatus.BLOCKED,
      },
      select: {
        id: true,
        friendshipStatus: true,
      },
    });
  }

  async unblockUser(userId: number, friendUsername: string) {
    this.logger.debug(
      `User ID <${userId}> is unblocking user <${friendUsername}>`,
    );

    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        receiver: { username: friendUsername },
      },
    });

    if (
      !friendRequest ||
      friendRequest.friendshipStatus !== FriendshipStatus.BLOCKED
    ) {
      throw new BadRequestException(`User <${friendUsername}> is not blocked`);
    }

    const request = await this.prisma.friendRequest.update({
      where: {
        senderId_receiverId: {
          senderId: friendRequest.senderId,
          receiverId: friendRequest.receiverId,
        },
      },
      data: {
        friendshipStatus: FriendshipStatus.PENDING,
      },
      select: {
        id: true,
        friendshipStatus: true,
      },
    });

    return { message: 'User unblocked', request };
  }

  listFriendsById(id: number) {
    return this.prisma.friendRequest
      .findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  senderId: { equals: id },
                },
                {
                  receiverId: { equals: id },
                },
              ],
            },
            {
              friendshipStatus: { equals: FriendshipStatus.ACCEPTED },
            },
          ],
        },
        select: {
          senderId: true,
          sender: {
            select: {
              username: true,
              avatar: true,
              status: true,
            },
          },
          receiverId: true,
          receiver: {
            select: {
              username: true,
              avatar: true,
              status: true,
            },
          },
        },
      })
      .then((friendRequests) => {
        const friends = friendRequests.map((friendRequest) => {
          if (friendRequest.senderId === id) {
            return friendRequest.receiver;
          }
          return friendRequest.sender;
        });
        return friends;
      });
  }
}
