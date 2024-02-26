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
    return this.prisma.friendRequest
      .findMany({
        where: {
          OR: [
            {
              senderId: userId,
              friendshipStatus: FriendshipStatus.ACCEPTED,
            },
            {
              receiverId: userId,
              friendshipStatus: FriendshipStatus.ACCEPTED,
            },
          ],
        },
        select: {
          sender: {
            select: {
              id: true,
              username: true,
              avatar: true,
              status: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              avatar: true,
              status: true,
            },
          },
        },
      })
      .then((requests) => {
        return requests.map((request) => {
          return request.sender.id === userId
            ? request.receiver
            : request.sender;
        });
      });
  }

  async removeFriend(userId: number, friendId: number) {
    const request = await this.prisma.friendRequest
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

    await this.prisma.notification.deleteMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: friendId,
          },
          {
            senderId: friendId,
            receiverId: userId,
          },
        ],
      },
    });

    return request;
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
    const existingFriendship = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: friendId,
          },
          {
            senderId: friendId,
            receiverId: userId,
          },
        ],
      },
    });

    if (existingFriendship) {
      return this.prisma.friendRequest.update({
        where: { id: existingFriendship.id },
        data: {
          senderId: userId,
          receiverId: friendId,
          friendshipStatus: FriendshipStatus.BLOCKED,
        },
        select: {
          id: true,
          friendshipStatus: true,
        },
      });
    } else {
      return this.prisma.friendRequest.create({
        data: {
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

  async getBlockedUsersIds(userId: number): Promise<number[]> {
    return this.prisma.friendRequest
      .findMany({
        where: {
          OR: [
            { senderId: { equals: userId } },
            { receiverId: { equals: userId } },
          ],
          friendshipStatus: { equals: FriendshipStatus.BLOCKED },
        },
        select: {
          receiver: {
            select: {
              id: true,
            },
          },
          sender: {
            select: {
              id: true,
            },
          },
        },
      })
      .then((requests) => {
        return requests.map((request) => {
          return request.sender.id === userId
            ? request.receiver.id
            : request.sender.id;
        });
      });
  }
}
