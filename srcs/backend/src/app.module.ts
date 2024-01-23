import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { FriendRequestsModule } from './friends/requests/requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SmsModule } from './sms/sms.module';
import { ChatModule } from './chat/chat.module';
import { UploadModule } from './upload/upload.module';
import { AchievementsModule } from './users/achievements/achievements.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    FriendsModule,
    FriendRequestsModule,
    NotificationsModule,
    RouterModule.register([
      {
        path: 'users',
        module: UsersModule,
        children: [
          {
            path: 'friends',
            module: FriendsModule,
            children: [{ path: 'requests', module: FriendRequestsModule }],
          },
          { path: 'notifications', module: NotificationsModule },
          { path: 'chat', module: ChatModule },
          { path: 'achievements', module: AchievementsModule },
        ],
      },
    ]),
    SmsModule,
    ChatModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
