import { conversationSelect } from './../../prisma/prisma.selects';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConversationType, MuteDuration, Status } from '@prisma/client';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatData } from 'src/common/interfaces/chat-data.interface';
import { Role } from 'src/common/enums/role.enum';
import { Gateway } from 'src/gateway/gateway';
import { DAY, HOUR, MINUTE } from 'src/common/constants/time.const';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly gateway: Gateway,
  ) {}

  createUniqueRoomName(id1: number, id2: number) {
    const sortedIds = [id1, id2].sort();
    return `Room${sortedIds[0]}-${sortedIds[1]}`;
  }

  async create(createChatDto: CreateChatDto) {
    this.logger.log(`Creating chat with data ${JSON.stringify(createChatDto)}`);

    const data: ChatData = {
      type: createChatDto.type,
      name: createChatDto.name,
      participants: {
        connect: createChatDto.participants.map((participantId: number) => ({
          id: participantId,
        })),
      },
    };

    if (createChatDto.type != ConversationType.DM) {
      data.owner = {
        connect: {
          id: createChatDto.ownerId,
        },
      };
    }

    if (createChatDto.password) data.password = createChatDto.password;
    if (createChatDto.image) data.image = createChatDto.image;

    return this.prismaService.conversation.create({
      data,
      select: conversationSelect,
    });
  }

  async findAll(userId: number) {
    this.logger.log('Finding all chats');
    return this.prismaService.conversation
      .findMany({
        where: {
          OR: [
            { type: ConversationType.PUBLIC },
            { type: ConversationType.PROTECTED },
          ],
        },
        select: conversationSelect,
        orderBy: {
          participants: {
            _count: 'desc',
          },
        },
      })
      .then((chats) => {
        return chats.map((chat) => {
          // Check if user is already in chat
          const isParticipant = chat.participants.some(
            (participant) => participant.id === userId,
          );
          const isOwner = chat.ownerId === userId;
          const isAdmin = chat.admins.some((admin) => admin.id === userId);

          return {
            id: chat.id,
            type: chat.type,
            name: chat.name,
            image: chat.image,
            members: chat.participants.length + chat.admins.length + 1,
            joined: isOwner || isAdmin || isParticipant,
          };
        });
      });
  }

  async findAllChatForUser(userId: number) {
    const blockedUsers = await this.prismaService.friendRequest
      .findMany({
        where: {
          OR: [
            {
              senderId: userId,
            },
            {
              receiverId: userId,
            },
          ],
          friendshipStatus: 'BLOCKED',
        },
        select: {
          senderId: true,
          receiverId: true,
        },
      })
      .then((friendRequests) => {
        return friendRequests
          .map((req) =>
            req.senderId === userId ? req.receiverId : req.senderId,
          )
          .filter((id: number) => id !== userId);
      });

    const userInfoSelect = {
      id: true,
      username: true,
      avatar: true,
      status: true,
    };

    return this.prismaService.conversation
      .findMany({
        where: {
          OR: [
            {
              participants: {
                some: {
                  id: userId,
                },
              },
            },
            {
              admins: {
                some: {
                  id: userId,
                },
              },
            },
            {
              ownerId: userId,
            },
          ],
        },
        select: conversationSelect,
      })
      .then((chats) => {
        return chats.filter((chat) => {
          // Filter out DMs with blocked users
          if (chat.type === ConversationType.DM) {
            return !chat.participants.some((participant) =>
              blockedUsers.includes(participant.id),
            );
          }

          // Filter out blocked users messages from group chats
          chat.messages = chat.messages.filter(
            (message) => !blockedUsers.includes(message.sender.id),
          );

          return true;
        });
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw new NotFoundException(err.message);
      });
  }

  findOne(id: number) {
    this.logger.log(`Finding chat with id ${id}`);
    return this.prismaService.conversation.findUniqueOrThrow({
      where: {
        id,
      },
      select: conversationSelect,
    });
  }

  update(id: number, data: { type?: ConversationType; password?: string }) {
    this.logger.log(`Updating chat with id ${id}`);

    return this.prismaService.conversation.update({
      where: {
        id,
      },
      data,
      select: conversationSelect,
    });
  }

  async remove(id: number) {
    this.logger.log(`Removing chat with id ${id}`);
    const chat = await this.prismaService.conversation.delete({
      where: {
        id,
      },
      select: conversationSelect,
    });

    const imagePath = chat.image;
    if (
      imagePath &&
      fs.existsSync(imagePath) &&
      !imagePath.startsWith('uploads/chat-default-images')
    ) {
      this.logger.log(`Removing image at path ${imagePath}`);
      fs.unlinkSync(imagePath);
    }

    return chat;
  }

  findMessages(id: number) {
    this.logger.log(`Finding messages for chat with id ${id}`);
    return this.prismaService.conversation
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .messages();
  }

  findParticipants(id: number) {
    this.logger.log(`Finding participants for chat with id ${id}`);
    return this.prismaService.conversation
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .participants();
  }

  findAdmins(id: number) {
    this.logger.log(`Finding admins for chat with id ${id}`);
    return this.prismaService.conversation
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .admins();
  }

  findOwner(id: number) {
    this.logger.log(`Finding owner for chat with id ${id}`);
    return this.prismaService.conversation
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .owner();
  }

  getUserFromSession(session: any) {
    const userId = session.passport.user;

    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  }

  toggleUserStatus(userId: number, status: Status) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        status,
      },
    });
  }

  async getRoomsByUserId(userId: number): Promise<string[]> {
    return this.prismaService.conversation
      .findMany({
        where: {
          OR: [
            {
              participants: {
                some: {
                  id: userId,
                },
              },
            },
            {
              admins: {
                some: {
                  id: userId,
                },
              },
            },
            {
              ownerId: userId,
            },
          ],
        },
      })
      .then((rooms) => rooms.map((room) => room.name));
  }

  async getUserChats(userId: number) {
    const userInfoSelect = {
      id: true,
      username: true,
      avatar: true,
      status: true,
    };

    return this.prismaService.conversation
      .findMany({
        where: {
          OR: [
            {
              participants: {
                some: {
                  id: userId,
                },
              },
            },
            {
              admins: {
                some: {
                  id: userId,
                },
              },
            },
            {
              owner: {
                id: userId,
              },
            },
          ],
        },
        select: conversationSelect,
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw new NotFoundException(err.message);
      });
  }

  async getChatNames() {
    return this.prismaService.conversation
      .findMany({
        where: {
          type: {
            not: ConversationType.DM,
          },
        },
        select: {
          name: true,
        },
      })
      .then((chats) => chats.map((chat) => chat.name));
  }

  getAvatar(id: number) {
    return this.prismaService.conversation
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .then((chat) => chat.image);
  }

  async addParticipant(chatId: number, participantId: number) {
    const conversation =
      await this.prismaService.conversation.findUniqueOrThrow({
        where: { id: chatId },
        include: { bannedUsers: true },
      });

    if (conversation.bannedUsers.some((user) => user.id === participantId)) {
      throw new BadRequestException('User is banned from this chat');
    }

    return this.prismaService.conversation.update({
      where: { id: chatId },
      data: {
        participants: {
          connect: {
            id: participantId,
          },
        },
      },
      select: conversationSelect,
    });
  }

  async removeParticipant(chatId: number, participantId: number) {
    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
      data: {
        participants: {
          disconnect: {
            id: participantId,
          },
        },
      },
      select: conversationSelect,
    });
  }

  async leaveChat(chatId: number, userId: number) {
    const chat = await this.prismaService.conversation.findUniqueOrThrow({
      where: {
        id: chatId,
      },
      include: {
        participants: true,
        admins: true,
      },
    });

    if (chat.ownerId === userId) {
      const newOwner = chat.admins.length
        ? chat.admins[0]?.id
        : chat.participants[0]?.id;

      if (!newOwner) {
        return this.remove(chatId);
      }

      return this.replaceOwner(chatId, newOwner);
    }

    return this.removeUser(chatId, userId);
  }

  async replaceOwner(chatId: number, newOwnerId: number) {
    await this.removeUser(chatId, newOwnerId);

    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
      data: {
        ownerId: newOwnerId,
      },
      select: conversationSelect,
    });
  }

  async addAdmin(chatId: number, adminId: number) {
    const chat = await this.prismaService.conversation.findUniqueOrThrow({
      where: {
        id: chatId,
      },
      include: {
        participants: true,
      },
    });

    let updateData = {
      admins: {
        connect: {
          id: adminId,
        },
      },
    };

    updateData['participants'] = {
      disconnect: {
        id: adminId,
      },
    };

    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
      data: updateData,
      select: conversationSelect,
    });
  }

  async removeAdmin(chatId: number, adminId: number) {
    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
      data: {
        admins: {
          disconnect: {
            id: adminId,
          },
        },
        participants: {
          connect: {
            id: adminId,
          },
        },
      },
      select: conversationSelect,
    });
  }

  async ban(chatId: number, userId: number, role: Role) {
    let updateData = {
      bannedUsers: {
        connect: {
          id: userId,
        },
      },
    };

    if (role === Role.ADMIN) {
      updateData['admins'] = {
        disconnect: {
          id: userId,
        },
      };
    } else {
      updateData['participants'] = {
        disconnect: {
          id: userId,
        },
      };
    }

    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
      data: updateData,
      select: conversationSelect,
    });
  }

  async unban(chatId: number, userId: number) {
    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
      data: {
        bannedUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
      select: conversationSelect,
    });
  }

  async getBannedUsers(chatId: number) {
    return this.prismaService.conversation
      .findUniqueOrThrow({
        where: {
          id: chatId,
        },
      })
      .bannedUsers();
  }

  async mute(chatId: number, userId: number, duration: MuteDuration) {
    const muted = await this.prismaService.mute.create({
      data: {
        userId: userId,
        conversationId: chatId,
        duration,
      },
    });

    if (muted) {
      return await this.prismaService.conversation.findUniqueOrThrow({
        where: { id: chatId },
        select: conversationSelect,
      });
    }
  }

  async unmute(chatId: number, userId: number) {
    const deleted = await this.prismaService.mute.deleteMany({
      where: {
        userId,
        conversationId: chatId,
      },
    });

    if (deleted) {
      return await this.prismaService.conversation.findUniqueOrThrow({
        where: { id: chatId },
        select: conversationSelect,
      });
    }
  }

  async findMuted(chatId: number) {
    return this.prismaService.mute.findMany({
      where: {
        conversationId: chatId,
      },
    });
  }

  async getPopularChats(userId: number) {
    return this.prismaService.conversation
      .findMany({
        where: {
          OR: [
            { type: ConversationType.PUBLIC },
            { type: ConversationType.PROTECTED },
          ],
        },
        select: conversationSelect,
        orderBy: {
          participants: {
            _count: 'desc',
          },
        },
        take: 4,
      })
      .then((chats) => {
        return chats.map((chat) => {
          // Check if user is already in chat
          const isParticipant = chat.participants.some(
            (participant) => participant.id === userId,
          );
          const isOwner = chat.ownerId === userId;
          const isAdmin = chat.admins.some((admin) => admin.id === userId);

          return {
            id: chat.id,
            type: chat.type,
            name: chat.name,
            image: chat.image,
            members: chat.participants.length + chat.admins.length + 1,
            joined: isOwner || isAdmin || isParticipant,
          };
        });
      });
  }

  async removeUser(chatId: number, userId: number) {
    const chat = await this.prismaService.conversation.findUniqueOrThrow({
      where: {
        id: chatId,
      },
      include: {
        participants: true,
        admins: true,
      },
    });

    if (chat.admins.some((admin) => admin.id === userId)) {
      return this.prismaService.conversation.update({
        where: {
          id: chatId,
        },
        data: {
          admins: {
            disconnect: {
              id: userId,
            },
          },
        },
        select: conversationSelect,
      });
    }

    return this.removeParticipant(chatId, userId);
  }

  async getMutedUsers() {
    return this.prismaService.mute.findMany();
  }

  async setMuteTimeout(mutedUser: {
    createdAt: Date;
    userId: number;
    conversationId: number;
    duration: MuteDuration;
  }) {
    const { userId, conversationId, duration, createdAt } = mutedUser;

    const time = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const difference = currentTime - time;
    let timeLeft = 0;

    switch (duration) {
      case MuteDuration.MINUTE:
        timeLeft = MINUTE - difference;
        break;
      case MuteDuration.HOUR:
        timeLeft = HOUR - difference;
        break;
      case MuteDuration.DAY:
        timeLeft = DAY - difference;
        break;
    }

    timeLeft = timeLeft < 0 ? 0 : timeLeft;

    setTimeout(async () => {
      const chat = await this.unmute(conversationId, userId);

      if (chat) {
        this.gateway.server.to(chat.name).emit('action', {
          action: 'unmute',
          user: userId,
          data: chat,
        });
      }
    }, timeLeft);
  }

  async joinChat(chatId: number, userId: number, password: string) {
    const chat = await this.prismaService.conversation.findUniqueOrThrow({
      where: {
        id: chatId,
      },
      include: {
        participants: true,
        bannedUsers: true,
      },
    });

    if (chat.bannedUsers.some((user) => user.id === userId)) {
      throw new BadRequestException('You are banned from this chat');
    }

    if (chat.password) {
      if (!password) {
        throw new BadRequestException('Password is required');
      }

      if (chat.password !== password) {
        throw new BadRequestException('Invalid password');
      }
    }

    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
      data: {
        participants: {
          connect: {
            id: userId,
          },
        },
      },
      select: conversationSelect,
    });
  }

  async findOneByName(name: string) {
    return this.prismaService.conversation.findUnique({
      where: { name },
    });
  }
}
