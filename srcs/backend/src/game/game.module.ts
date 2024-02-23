import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { NotificationsModule } from 'src/users/notifications/notifications.module';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
  imports: [forwardRef(() => NotificationsModule)],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
