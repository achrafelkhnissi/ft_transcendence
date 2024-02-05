import { Controller, Get } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';

@Controller('game')
export class GameController {
  @Get(':id/history')
  getGameHistory(@User() user: UserType) {
    return this;
  }
}
