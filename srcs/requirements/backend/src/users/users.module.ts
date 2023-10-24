import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendsModule } from './friends/friends.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    PrismaModule,
    FriendsModule, // TODO: This cause a circular dependency, but it's needed for the route to work
    RouterModule.register([
      {
        path: 'users',
        module: UsersModule,
        children: [
          {
            path: 'friends',
            module: FriendsModule,
          },
        ],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // TODO: Check if this is needed and why
})
export class UsersModule {}
