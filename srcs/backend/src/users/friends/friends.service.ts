import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FriendshipStatus } from '@prisma/client';
import { UserNotFoundException } from 'src/common/exceptions/UserNotFound.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async listFriendsById(userId: number) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        friendRequestsSent: {
          where: {
            friendshipStatus: FriendshipStatus.ACCEPTED,
          },
          include: {
            receiver: {
              select: {
                id: true,
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
                id: true,
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
      throw new NotFoundException(`User with id <${userId}> not found`);
    }

    const friends = [
      ...user.friendRequestsSent.map((friendRequest) => friendRequest.receiver),
      ...user.friendRequestsReceived.map(
        (friendRequest) => friendRequest.sender,
      ),
    ];

    return friends;
  }

  async removeFriend(userId: number, friendId: number) {
    return this.prisma.friendRequest
      .deleteMany({
        where: {
          AND: [
            {
              OR: [
                {
                  senderId: { equals: userId },
                  receiverId: { equals: friendId },
                },
                {
                  senderId: { equals: friendId },
                  receiverId: { equals: userId },
                },
              ],
            },
            {
              friendshipStatus: { equals: FriendshipStatus.ACCEPTED },
            },
          ],
        },
      })
      .then((friendRequest) => {
        if (friendRequest.count === 0) {
          throw new UserNotFoundException(friendId);
        }

        return friendRequest;
      });
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
            id: true,
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

  async blockUser(userId: number, friendId: number) {
    return this.prisma.friendRequest.upsert({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: friendId,
        },
      },
      update: {
        senderId: userId,
        receiverId: friendId,
        friendshipStatus: FriendshipStatus.BLOCKED,
      },
      create: {
        senderId: userId,
        receiverId: friendId,
        friendshipStatus: FriendshipStatus.BLOCKED,
      },
      select: {
        id: true,
        friendshipStatus: true,
      },
    });
  }

  async unblockUser(userId: number, friendId: number) {
    this.logger.debug(`User ID <${userId}> is unblocking user <${friendId}>`);

    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        AND: [
          { senderId: { equals: userId } },
          { receiverId: { equals: friendId } },
        ],
      },
    });

    if (
      !friendRequest ||
      friendRequest.friendshipStatus !== FriendshipStatus.BLOCKED
    ) {
      throw new BadRequestException(`User <${friendId}> is not blocked`);
    }

    const request = await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: friendRequest.senderId,
          receiverId: friendRequest.receiverId,
        },
      },
    });

    return { message: 'User unblocked', request };
  }
}
