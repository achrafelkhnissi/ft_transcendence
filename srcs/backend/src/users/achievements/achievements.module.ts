import { Module } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AchievementsService],
})
export class AchievementsModule {}
