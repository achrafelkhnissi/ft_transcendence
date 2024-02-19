import { Module } from '@nestjs/common';
import { FriendRequestsService } from './requests.service';
import { FriendRequestsController } from './requests.controller';
import { NotificationsModule } from 'src/users/notifications/notifications.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { AchievementsModule } from 'src/users/achievements/achievements.module';

@Module({
  imports: [NotificationsModule, GatewayModule, AchievementsModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
})
export class FriendRequestsModule {}
