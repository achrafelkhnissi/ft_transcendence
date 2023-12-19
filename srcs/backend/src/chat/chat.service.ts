import { Injectable, Logger } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prismaService: PrismaService) {}

  create(createChatDto: CreateChatDto) {
    this.logger.log(`Creating chat with data ${JSON.stringify(createChatDto)}`);
    return this.prismaService.chat.create({
      data: createChatDto,
    });
  }

  findAll() {
    this.logger.log('Finding all chats');
    return this.prismaService.chat.findMany();
  }

  findOne(id: number) {
    this.logger.log(`Finding chat with id ${id}`);
    return this.prismaService.chat.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    this.logger.log(`Updating chat with id ${id}`);

    return this.prismaService.chat.update({
      where: {
        id,
      },
      data: updateChatDto,
    });
  }

  // TODO: Check if the logged in user has permission to remove a chat
  remove(id: number) {
    this.logger.log(`Removing chat with id ${id}`);
    return this.prismaService.chat.delete({
      where: {
        id,
      },
    });
  }

  // TODO: maybe use message service instead?
  findMessages(id: number) {
    this.logger.log(`Finding messages for chat with id ${id}`);
    return this.prismaService.chat
      .findUnique({
        where: {
          id,
        },
      })
      .messages();
  }

  findParticipants(id: number) {
    this.logger.log(`Finding participants for chat with id ${id}`);
    return this.prismaService.chat
      .findUnique({
        where: {
          id,
        },
      })
      .users();
  }

  findAdmins(id: number) {
    this.logger.log(`Finding admins for chat with id ${id}`);
    return this.prismaService.chat
      .findUnique({
        where: {
          id,
        },
      })
      .admins();
  }

  findOwner(id: number) {
    this.logger.log(`Finding owner for chat with id ${id}`);
    return this.prismaService.chat
      .findUnique({
        where: {
          id,
        },
      })
      .owner();
  }

  addAdmin(id: number, userId: number) {
    this.logger.log(`Adding admin with id ${userId} to chat with id ${id}`);
    return this.prismaService.chat.update({
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
  removeUser(id: number, userId: number) {
    this.logger.log(`Removing user with id ${userId} from chat with id ${id}`);
    return this.prismaService.chat.update({
      where: {
        id,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  removeAdmin(id: number, userId: number) {
    this.logger.log(`Removing admin with id ${userId} from chat with id ${id}`);
    return this.prismaService.chat.update({
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
    // TODO: add user to chat {room} in db
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

  // getAllChatsFromUser(user: any) {}
}
