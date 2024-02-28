import { Injectable, Logger } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface MessagePayload {
  senderId: number;
  content: string;
  conversationId: number;
}

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(messageData: MessagePayload) {
    const { content, conversationId, senderId } = messageData;

    return this.prismaService.message.create({
      data: {
        content,
        conversationId,
        senderId,
      },
      select: {
        id: true,
        readBy: true,
        content: true,
        createdAt: true,
        conversationId: true,
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            status: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prismaService.message.findMany();
  }

  findOne(id: number) {
    return this.prismaService.message.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  findByChatId(conversationId: number) {
    return this.prismaService.message.findMany({
      where: {
        conversationId,
      },
      select: {
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return this.prismaService.message.update({
      where: {
        id,
      },
      data: {
        ...updateMessageDto,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.message.delete({
      where: {
        id,
      },
    });
  }
}
