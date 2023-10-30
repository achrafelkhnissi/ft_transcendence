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
        ],
      },
    ]),
    EventEmitterModule.forRoot({
      global: true,
    }),
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
