import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MessageModule } from './message/message.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [MessageModule, GatewayModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
