import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { GatewayModule } from 'src/gateway/gateway.module';
import { FriendsModule } from 'src/users/friends/friends.module';

@Module({
  imports: [GatewayModule, FriendsModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
