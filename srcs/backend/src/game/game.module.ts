import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { NotificationsModule } from 'src/users/notifications/notifications.module';
import { AchievementsModule } from 'src/users/achievements/achievements.module';

@Module({
  imports: [forwardRef(() => NotificationsModule), AchievementsModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
