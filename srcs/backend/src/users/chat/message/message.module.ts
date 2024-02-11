import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessageController } from './message.controller';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [PrismaModule, GatewayModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
