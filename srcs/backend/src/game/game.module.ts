import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { NotificationsModule } from 'src/users/notifications/notifications.module';
import { AchievementsModule } from 'src/users/achievements/achievements.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [AchievementsModule, forwardRef(() => GatewayModule)],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
