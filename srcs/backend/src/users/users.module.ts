import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendsModule } from 'src/friends/friends.module';
import { AchievementsModule } from './achievements/achievements.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => FriendsModule),
    FriendsModule,
    AchievementsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
