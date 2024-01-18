import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [PrismaModule, MessageModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
