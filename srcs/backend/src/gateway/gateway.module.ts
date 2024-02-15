import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { GameModule } from 'src/game/game.module';
import { GatewayService } from './gateway.service';

@Module({
  imports: [GameModule],
  providers: [Gateway, GatewayService],
  exports: [Gateway],
})
export class GatewayModule {}
