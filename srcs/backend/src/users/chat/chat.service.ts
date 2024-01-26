import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { Conversation, ConversationType, Status } from '@prisma/client';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatData } from 'src/common/interfaces/chat-data.interface';

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

  findAllChatForUser(id: number) {
    this.logger.log(`Finding all chats for user with id ${id}`);

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
                  id,
                },
              },
            },
            {
              admins: {
                some: {
                  id,
                },
              },
            },
            {
              ownerId: id,
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
              receiver: {
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

  findOne(id: number) {
    this.logger.log(`Finding chat with id ${id}`);
    return this.prismaService.conversation.findUnique({
      where: {
        id,
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

  addAdmin(id: number, userId: number) {
    this.logger.log(`Adding admin with id ${userId} to chat with id ${id}`);
    return this.prismaService.conversation.update({
      where: {
        id,
      },
      data: {
        admins: {
          connect: {
            id: userId,
          },
        },
      },
    });
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

  removeAdmin(id: number, userId: number) {
    this.logger.log(`Removing admin with id ${userId} from chat with id ${id}`);
    return this.prismaService.conversation.update({
      where: {
        id,
      },
      data: {
        admins: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

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

  async getUserChats(username: string) {
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
                  username,
                },
              },
            },
            {
              admins: {
                some: {
                  username,
                },
              },
            },
            {
              owner: {
                username,
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
              receiver: {
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
}
