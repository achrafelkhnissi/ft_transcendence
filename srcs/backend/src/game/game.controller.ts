import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GameService } from './game.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('game')
@ApiForbiddenResponse({ description: 'Forbidden' })
@UseGuards(AuthGuard)
@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiOkResponse({ description: 'Return array of games for user' })
  @ApiOperation({ summary: 'Get all games for user' })
  @Get(':id/history')
  getGameHistory(@Param('id', ParseIntPipe) id: number) {
    return this.gameService.getGameHistory(id);
  }
}
