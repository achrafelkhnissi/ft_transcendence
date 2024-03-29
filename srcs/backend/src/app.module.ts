import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './users/friends/friends.module';
import { FriendRequestsModule } from './users/friends/requests/requests.module';
import { NotificationsModule } from './users/notifications/notifications.module';
import { SmsModule } from './auth/sms/sms.module';
import { ChatModule } from './users/chat/chat.module';
import { UploadModule } from './upload/upload.module';
import { AchievementsModule } from './users/achievements/achievements.module';
import { MessageModule } from './users/chat/message/message.module';
import { GameModule } from './game/game.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    FriendsModule,
    FriendRequestsModule,
    NotificationsModule,
    MessageModule,
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
          { path: 'achievements', module: AchievementsModule },
          { path: 'game', module: GameModule },
          { path: 'chat', module: ChatModule, children: [{ path: 'message', module: MessageModule }] },
        ],
      },
    ]),
    SmsModule,
    ChatModule,
    UploadModule,
    GameModule,
    GatewayModule,
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
