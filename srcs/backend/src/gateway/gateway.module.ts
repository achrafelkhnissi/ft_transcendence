import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { GameModule } from 'src/game/game.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GatewayService } from './gateway.service';

@Module({
  imports: [PrismaModule, GameModule],
  providers: [Gateway, GatewayService],
  exports: [Gateway],
})
export class GatewayModule {}
