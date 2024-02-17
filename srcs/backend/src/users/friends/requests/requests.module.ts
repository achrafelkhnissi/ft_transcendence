import { Module } from '@nestjs/common';
import { FriendRequestsService } from './requests.service';
import { FriendRequestsController } from './requests.controller';
import { NotificationsModule } from 'src/users/notifications/notifications.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [NotificationsModule, GatewayModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
})
export class FriendRequestsModule {}
