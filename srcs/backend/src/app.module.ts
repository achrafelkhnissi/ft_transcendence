import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SmsModule } from './sms/sms.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { UploadModule } from './upload/upload.module';
import { AchievementsModule } from './achievements/achievements.module';

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
            children: [
              {
                path: 'requests',
                module: FriendRequestsModule,
              },
            ],
          },
          {
            path: 'notifications',
            module: NotificationsModule,
          },
          {
            path: 'chat',
            module: ChatModule,
            children: [
              {
                path: 'message',
                module: MessageModule,
              },
            ],
          },
        ],
      },
    ]),
    EventEmitterModule.forRoot({
      global: true,
    }),
    SmsModule,
    ChatModule,
    MessageModule,
    UploadModule,
    AchievementsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // TODO: ClassSerializerInterceptor is the reason why SMS verification is not working
    // TODO: I test it with Get request and it did not work before uncommenting ClassSerializerInterceptor
    // TODO: Test with with Post request
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
