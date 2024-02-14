import { Module } from '@nestjs/common';
import { FriendRequestsService } from './requests.service';
import { FriendRequestsController } from './requests.controller';
import { NotificationsModule } from 'src/users/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
})
export class FriendRequestsModule {}
