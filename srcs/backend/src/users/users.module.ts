import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendsModule } from 'src/friends/friends.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [PrismaModule, forwardRef(() => FriendsModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // TODO: Check if this is needed and why
})
export class UsersModule {}
