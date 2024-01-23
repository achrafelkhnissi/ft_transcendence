import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendsModule } from './friends/friends.module';
import { AchievementsModule } from './achievements/achievements.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => FriendsModule),
    FriendsModule,
    AchievementsModule,
    NotificationsModule,
    ChatModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
