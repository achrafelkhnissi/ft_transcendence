import { Controller, Get } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { GameService } from './game.service';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id/history')
  getGameHistory(@User() user: UserType) {
    return this.gameService.getGameHistory(user.id);
  }
}
