import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

@Module({
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
