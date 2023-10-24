import { Module, forwardRef } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersModule } from '../users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
