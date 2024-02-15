import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

@Module({
  providers: [AchievementsService],
})
export class AchievementsModule {}
