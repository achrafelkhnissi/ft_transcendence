import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly prismaService: PrismaService) {}

  // TODO: Check if senderId is needed because we can get it from the currently logged in user
  create(createMessageDto: CreateMessageDto) {
    const { content, chatId, senderId, receiverId } = createMessageDto;

    this.logger.log(
      `User ${senderId} sent a message to user ${receiverId} in chat ${chatId} with content ${content}`,
    );

    return this.prismaService.message.create({
      data: {
        content,
        chatId,
        senderId,
        receiverId,
      },
    });
  }

  findAll() {
    this.logger.log('Finding all messages');
    return this.prismaService.message.findMany();
  }

  findOne(id: number) {
    this.logger.log(`Finding message with id ${id}`);
    return this.prismaService.message.findUnique({
      where: {
        id,
      },
    });
  }

  findByChatId(chatId: number) {
    this.logger.log(`Finding messages with chatId ${chatId}`);
    return this.prismaService.message.findMany({
      where: {
        chatId,
      },
    });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    this.logger.log(`Updating message with id ${id}`);
    const { content } = updateMessageDto;
    return this.prismaService.message.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
  }

  remove(id: number) {
    this.logger.log(`Deleting message with id ${id}`);
    return this.prismaService.message.delete({
      where: {
        id,
      },
    });
  }
}
