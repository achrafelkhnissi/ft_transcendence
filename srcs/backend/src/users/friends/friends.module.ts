import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendRequestsModule } from './requests/requests.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [FriendRequestsModule, GatewayModule],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
