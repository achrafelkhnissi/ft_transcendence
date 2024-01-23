import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FriendshipStatus, NotificationType } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';

//TODO: Test notifications for friend requests
@Injectable()
export class FriendRequestsService {
  private readonly logger = new Logger(FriendRequestsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationsService,
  ) {}

  // TODO: See where to put this
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

  async sendFriendRequest(senderId: number, receiverUsername: string) {
    const [sender, receiver] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: senderId },
      }),
      this.prisma.user.findUnique({
        where: { username: receiverUsername },
      }),
    ]);

    if (!sender || !receiver) {
      throw new NotFoundException(
        `User <${senderId}> or <${receiverUsername}> not found`,
      );
    }

    if (await this.isFriends(senderId, receiver.id)) {
      throw new BadRequestException(
        `Users <${sender.username}> and <${receiver.username}> are already friends`,
      );
    }

    const request = await this.prisma.friendRequest.upsert({
      where: {
        senderId_receiverId: { senderId, receiverId: receiver.id },
      },
      update: {
        friendshipStatus: FriendshipStatus.PENDING,
      },
      create: {
        senderId: senderId,
        receiverId: receiver.id,
        friendshipStatus: FriendshipStatus.PENDING,
      },
    });

    console.log({
      request,
    });

    const notification = await this.notification.create({
      receiverId: receiver.id,
      senderId: senderId,
      type: NotificationType.FRIEND_REQUEST,
      friendRequestId: request.id,
    });

    if (!notification) {
      throw new BadRequestException(
        `Friend request from <${sender.username}> to <${receiver.username}> already exists`,
      );
    }

    this.logger.log(
      `User <${sender.username}> sent a friend request to <${receiver.username}>`,
    );

    return { message: 'Friend request sent', request };
  }

  async acceptFriendRequest(receiverId: number, senderUsername: string) {
    const sender = await this.prisma.user.findUnique({
      where: { username: senderUsername },
    });

    if (!sender) {
      throw new NotFoundException(`User ${senderUsername} not found`);
    }

    this.logger.log({
      receiverId,
      senderUsername,
    });

    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: { senderId: sender.id, receiverId },
      },
    });

    if (!friendRequest) {
      throw new NotFoundException(
        `Friend request from <${sender.id}> to <${receiverId}> not found`,
      );
    }

    if (friendRequest.friendshipStatus !== FriendshipStatus.PENDING) {
      throw new BadRequestException(
        `Friend request from <${sender.id}> to <${receiverId}> is not pending`,
      );
    }

    const request = await this.prisma.friendRequest.update({
      where: {
        senderId_receiverId: { senderId: sender.id, receiverId },
      },
      data: {
        friendshipStatus: FriendshipStatus.ACCEPTED,
      },
    });

    const notification = await this.notification.create({
      receiverId: receiverId,
      senderId: sender.id,
      type: NotificationType.FRIEND_REQUEST, // TODO: Change to FRIEND_REQUEST_ACCEPT
      friendRequestId: request.id,
    });

    this.logger.log(`Friend request accepted from <${senderUsername}>`);

    return { message: 'Friend request accepted', request };
  }

  async declineFriendRequest(receiverId: number, senderUsername: string) {
    this.logger.log(
      `Rejecting friend request from <${senderUsername}> to <${receiverId}>`,
    );
    const sender = await this.prisma.user.findUnique({
      where: { username: senderUsername },
    });

    if (!sender) {
      throw new NotFoundException(`User <${senderUsername}> not found`);
    }

    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: { senderId: sender.id, receiverId },
      },
    });

    if (!friendRequest) {
      throw new NotFoundException(
        `Friend request from <${senderUsername}> to <${receiverId}> not found`,
      );
    }

    if (friendRequest.friendshipStatus !== FriendshipStatus.PENDING) {
      throw new BadRequestException(
        `Friend request from <${senderUsername}> to <${receiverId}> not found`,
      );
    }

    const request = await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: { senderId: sender.id, receiverId },
      },
    });

    return { message: 'Friend request rejected', request };
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

  async cancelFriendRequest(senderId: number, receiverUsername: string) {
    this.logger.log(
      `User <${senderId}> is cancelling a friend request to user <${receiverUsername}>`,
    );
    const receiver = await this.prisma.user.findUnique({
      where: { username: receiverUsername },
    });

    if (!receiver) {
      throw new NotFoundException(`User <${receiverUsername}> not found`);
    }

    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId: receiver.id },
      },
    });

    if (!friendRequest) {
      throw new NotFoundException(
        `Friend request from <${senderId}> to <${receiver.id}> not found`,
      );
    }

    if (friendRequest.friendshipStatus !== FriendshipStatus.PENDING) {
      throw new BadRequestException(
        `Friend request from <${senderId}> to <${receiver.id}> not found`,
      );
    }

    const request = await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: { senderId, receiverId: receiver.id },
      },
    });

    return { message: 'Friend request cancelled', request };
  }
}
