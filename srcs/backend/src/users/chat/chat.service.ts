import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { Conversation, ConversationType, Status } from '@prisma/client';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatData } from 'src/common/interfaces/chat-data.interface';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prismaService: PrismaService) {}

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
        select: {
          id: true,
          type: true,
          name: true,
          updatedAt: true,
          owner: {
            select: userInfoSelect,
          },
          participants: {
            select: userInfoSelect,
          },
          admins: {
            select: userInfoSelect,
          },
          messages: {
            select: {
              id: true,
              content: true,
              isRead: true,
              conversationId: true,
              createdAt: true,
              sender: {
                select: userInfoSelect,
              },
            },
          },
        },
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
      select: {
        id: true,
        type: true,
        name: true,
        updatedAt: true,
        ownerId: true,
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true,
          },
        },
        participants: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true,
          },
        },
        admins: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true,
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            isRead: true,
            createdAt: true,
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
  }

  update(id: number, updateChatDto: any) {
    // TODO: Update any to UpdateChatDto
    this.logger.log(`Updating chat with id ${id}`);

    return this.prismaService.conversation.update({
      where: {
        id,
      },
      data: updateChatDto,
    });
  }

  // TODO: Check if the logged in user has permission to remove a chat
  remove(id: number) {
    this.logger.log(`Removing chat with id ${id}`);
    return this.prismaService.conversation.delete({
      where: {
        id,
      },
    });
  }

  // TODO: maybe use message service instead?
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

  // TODO: Check if the logged in user has permission to remove a user from a chat
  // removeUser(id: number, userId: number) {
  //   this.logger.log(`Removing user with id ${userId} from chat with id ${id}`);
  //   return this.prismaService.conversation.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       participants: {
  //         disconnect: {
  //           userId_conversationId: { userId, conversationId: id },
  //         },
  //       },
  //     },
  //   });
  // }

  /* --- Gateway --- */
  getUserFromSocket(socket: Socket) {
    // TODO: Test this
    return socket.handshake.auth.user;
  }

  addUserToChat(user: any, room: string) {
    // this.prismaService.conversation.upsert({
    //   where: {
    //     name: room,
    //   },
    //   update: {
    //     participants: {
    //       connect: {
    //         id: user.id,
    //       },
    //     },
    //   },
    //   create: {
    //     name: room,
    //     participants: {
    //       connect: {
    //         id: user.id,
    //       },
    //     },
    //   },
    // });
  }

  removeUserFromChat(user: any, room: string) {
    // TODO: remove user form chat {room} in db
  }

  getAllMessagesFromChat(room: string) {
    // TODO: get all messages from chat {room} in db
  }

  getAllUsersFromChat(room: string) {}

  getAllAdminsFromChat(room: string) {}

  getChatOwner(room: string) {}

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
        select: {
          id: true,
          type: true,
          name: true,
          updatedAt: true,
          owner: {
            select: userInfoSelect,
          },
          participants: {
            select: userInfoSelect,
          },
          admins: {
            select: userInfoSelect,
          },
          messages: {
            select: {
              id: true,
              content: true,
              isRead: true,
              createdAt: true,
              sender: {
                select: userInfoSelect,
              },
            },
          },
        },
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw new NotFoundException(err.message);
      });
  }

  async getChatNames() {
    return this.prismaService.conversation
      .findMany({
        // where: {
        //   type: {
        //     not: ConversationType.DM,
        //   },
        // },
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
        ? chat.admins[0].id
        : chat.participants[0].id;

      return this.replaceOwner(chatId, newOwner);
    }

    if (chat.admins.some((admin) => admin.id === userId)) {
      return this.removeAdmin(chatId, userId);
    }

    return this.removeParticipant(chatId, userId);
  }

  async replaceOwner(chatId: number, newOwnerId: number) {
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

    if (!chat.participants.some((participant) => participant.id === adminId)) {
      updateData['participants'] = {
        disconnect: {
          id: adminId,
        },
      };
    }

    return this.prismaService.conversation.update({
      where: {
        id: chatId,
      },
      data: updateData,
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

  async mute(chatId: number, userId: number, duration: number) {
    return this.prismaService.mute.create({
      data: {
        userId: userId,
        conversationId: chatId,
        duration,
      },
    });
  }

  async unmute(chatId: number, userId: number) {
    return this.prismaService.mute.deleteMany({
      where: {
        userId,
        conversationId: chatId,
      },
    });
  }

  async findMuted(chatId: number) {
    return this.prismaService.mute.findMany({
      where: {
        conversationId: chatId,
      },
    });
  }
}
