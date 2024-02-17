import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  FriendshipStatus,
  NotificationType,
  RequestStatus,
} from '@prisma/client';
import { NotificationsService } from 'src/users/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Gateway } from 'src/gateway/gateway';

@Injectable()
export class FriendRequestsService {
  private readonly logger = new Logger(FriendRequestsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationsService,
    private readonly gateway: Gateway,
  ) {}

  private async isFriends(
    senderId: number,
    receiverId: number,
  ): Promise<boolean> {
    this.logger.log(
      `Checking if users <${senderId}> and <${receiverId}> are friends`,
    );

    if (senderId === receiverId) {
      return false;
    }

    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
        friendshipStatus: FriendshipStatus.ACCEPTED,
      },
    });

    return !!friendRequest;
  }

  async sendFriendRequest(senderId: number, receiverId: number) {
    if (await this.isFriends(senderId, receiverId)) {
      throw new BadRequestException(
        `Users <${senderId}> and <${receiverId}> are already friends`,
      );
    }

    const request = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: { senderId: receiverId, receiverId: senderId },
      },
    });

    if (request) {
      const r = await this.acceptFriendRequest(senderId, receiverId);
      await this.notification.deleteNotification(r.id);
      await this.notification.create({
        receiverId: senderId,
        senderId: receiverId,
        type: NotificationType.FRIEND_REQUEST_ACCEPTED,
        requestId: r.id,
        requestStatus: RequestStatus.ACCEPTED,
      });

      this.gateway.server
        .to(`user-${senderId}`)
        .emit('friend-request-accepted', {
          senderId: receiverId,
          receiverId: senderId,
          requestId: r.id,
        });

      return r;
    }

    const friendRequest = await this.prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        friendshipStatus: FriendshipStatus.PENDING,
      },
    });

    const notification = await this.notification.create({
      receiverId: receiverId,
      senderId: senderId,
      type: NotificationType.FRIEND_REQUEST_SENT,
      requestId: friendRequest.id,
      requestStatus: RequestStatus.PENDING,
    });

    if (!notification) {
      throw new BadRequestException(
        `Friend request from <${senderId}> to <${receiverId}> already exists`,
      );
    }

    this.logger.log(
      `User <${senderId}> sent a friend request to <${receiverId}>`,
    );

    return friendRequest;
  }

  async acceptFriendRequest(receiverId: number, senderId: number) {
    const request = await this.prisma.friendRequest.update({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
      data: {
        friendshipStatus: FriendshipStatus.ACCEPTED,
      },
    });

    if (!request) {
      throw new NotFoundException(
        `Friend request from <${senderId}> to <${receiverId}> not found`,
      );
    }

    await this.notification.create({
      senderId: receiverId,
      receiverId: senderId,
      type: NotificationType.FRIEND_REQUEST_ACCEPTED,
      requestId: request.id,
      requestStatus: RequestStatus.ACCEPTED,
    });

    return request;
  }

  async declineFriendRequest(receiverId: number, senderId: number) {
    const friendRequest = await this.prisma.friendRequest.findUniqueOrThrow({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });

    if (!friendRequest) {
      throw new NotFoundException(
        `Friend request from <${senderId}> to <${receiverId}> not found`,
      );
    }

    if (friendRequest.friendshipStatus !== FriendshipStatus.PENDING) {
      throw new BadRequestException(
        `Friend request from <${senderId}> to <${receiverId}> not found`,
      );
    }

    this.notification.deleteNotification(friendRequest.id);

    return this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });
  }

  async listSentFriendRequests(userId: number) {
    this.logger.log(`Listing sent friend requests for user <${userId}>`);
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        AND: [
          {
            senderId: { equals: userId },
          },
          {
            friendshipStatus: { equals: FriendshipStatus.PENDING },
          },
        ],
      },
    });

    return friendRequests;
  }

  async listReceivedFriendRequests(userId: number) {
    this.logger.log(`Listing received friend requests for user <${userId}>`);
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        AND: [
          {
            receiverId: { equals: userId },
          },
          {
            friendshipStatus: { equals: FriendshipStatus.PENDING },
          },
        ],
      },
    });

    return friendRequests;
  }

  async cancelFriendRequest(senderId: number, receiverId: number) {
    const friendRequest = await this.prisma.friendRequest.findUniqueOrThrow({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });

    if (!friendRequest) {
      throw new NotFoundException(
        `Friend request from <${senderId}> to <${receiverId}> not found`,
      );
    }

    if (friendRequest.friendshipStatus !== FriendshipStatus.PENDING) {
      throw new BadRequestException(
        `Friend request from <${senderId}> to <${receiverId}> not found`,
      );
    }

    await this.notification.deleteNotification(friendRequest.id);

    return this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
    });
  }
}
