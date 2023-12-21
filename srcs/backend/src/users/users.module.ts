import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [PrismaModule, forwardRef(() => FriendsModule), FriendsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
