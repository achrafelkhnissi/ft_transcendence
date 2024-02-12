import { conversationSelect } from './../../prisma/prisma.selects';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import {
  Conversation,
  ConversationType,
  MuteDuration,
  Status,
} from '@prisma/client';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatData } from 'src/common/interfaces/chat-data.interface';
import { Role } from 'src/common/enums/role.enum';
import { Gateway } from 'src/gateway/gateway';
import { UpdateChatDto } from './dto/update-chat.dto';

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

    const chat: Conversation = await this.prismaService.conversation.findUnique(
      {
        where: {
          name: createChatDto.name,
        },
      },
    );

    if (chat) {
      return chat;
    }

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
    });
  }

  findAll() {
    this.logger.log('Finding all chats');
    return this.prismaService.conversation.findMany();
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
    return this.prismaService.conversation.findUnique({
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

  remove(id: number) {
    this.logger.log(`Removing chat with id ${id}`);
    return this.prismaService.conversation.delete({
      where: {
        id,
      },
    });
  }

  findMessages(id: number) {
    this.logger.log(`Finding messages for chat with id ${id}`);
    return this.prismaService.conversation
      .findUnique({
        where: {
          id,
        },
      })
      .messages();
  }

  findParticipants(id: number) {
    this.logger.log(`Finding participants for chat with id ${id}`);
    return this.prismaService.conversation
      .findUnique({
        where: {
          id,
        },
      })
      .participants();
  }

  findAdmins(id: number) {
    this.logger.log(`Finding admins for chat with id ${id}`);
    return this.prismaService.conversation
      .findUnique({
        where: {
          id,
        },
      })
      .admins();
  }

  findOwner(id: number) {
    this.logger.log(`Finding owner for chat with id ${id}`);
    return this.prismaService.conversation
      .findUnique({
        where: {
          id,
        },
      })
      .owner();
  }

  getUserFromSession(session: any) {
    const userId = session.passport.user;

    return this.prismaService.user.findUnique({
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
      .findUnique({
        where: {
          id,
        },
      })
      .then((chat) => chat.image);
  }

  async addParticipant(chatId: number, participantId: number) {
    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
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
    const chat = await this.prismaService.conversation.findUnique({
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

      // If admins & participants is empty remove chat
      if (!newOwner) {
        this.remove(chatId);
      }

      return this.replaceOwner(chatId, newOwner);
    }

    if (chat.admins.some((admin) => admin.id === userId)) {
      return this.removeAdmin(chatId, userId);
    }

    return this.removeParticipant(chatId, userId);
  }

  async replaceOwner(chatId: number, newOwnerId: number) {
    if (newOwnerId === null) {
      return this.prismaService.conversation.delete({
        where: {
          id: chatId,
        },
      });
    }

    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
      data: {
        ownerId: newOwnerId,
      },
    });
  }

  async addAdmin(chatId: number, adminId: number) {
    const chat = await this.prismaService.conversation.findUnique({
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
      .findUnique({
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
      return await this.prismaService.conversation.findUnique({
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
      return await this.prismaService.conversation.findUnique({
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

  async getPopularChats() {
    return this.prismaService.conversation.findMany({
      where: {
        OR: [
          { type: ConversationType.PUBLIC },
          { type: ConversationType.PROTECTED },
        ],
      },
      select: {
        id: true,
        type: true,
        name: true,
        image: true,
        _count: {
          select: {
            participants: true,
            admins: true,
          },
        },
      },
      orderBy: {
        participants: {
          _count: 'desc',
        },
      },
      take: 4,
    });
  }

  async removeUser(chatId: number, userId: number) {
    const chat = await this.prismaService.conversation.findUnique({
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
}
