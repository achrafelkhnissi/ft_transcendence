import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
// import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [PrismaModule /*FriendsModule*/],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // TODO: Check if this is needed and why
})
export class UsersModule {}
