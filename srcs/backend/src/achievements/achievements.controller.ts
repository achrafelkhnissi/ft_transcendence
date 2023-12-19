import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
// import { AuthGuard } from 'src/guards/auth.guard';

// @UseGuards(AuthGuard)
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  @Get()
  findAll() {
    return this.achievementsService.findAll();
  }

  @Get('name/:name')
  findAchievementByName(@Param('name') name: string) {
    return this.achievementsService.findAchievementByName(name);
  }

  @Get()
  getAchievementFromQuery(@Query('name') name: string) {
    return this.achievementsService.findAchievementByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    return this.achievementsService.update(+id, updateAchievementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(+id);
  }

  // TODO: Get all achievements for a user (put this in users controller?)
  // @Get(':id/users')
  // getUserAchievements(@Param('id') id: string) {
  //   return this.achievementsService.getUserAchievements(+id);
  // }

  // TODO: Maybe change id to name?
  @Get(':id/users')
  getAchievementUsers(@Param('id') id: string) {
    return this.achievementsService.getAchievementUsers(+id);
  }

  // TODO: Give achievement to user
  @Post(':id/users')
  giveAchievementToUser(@Body() body) {
    // const { achievementName, userName  } = body;
    const { achievementId, userId } = body;

    return this.achievementsService.giveAchievementToUser(
      achievementId,
      userId,
    );
  }

  // TODO: Remove achievement from user
  @Delete(':id/users')
  removeAchievementFromUser(@Body() body) {
    const { achievementId, userId } = body;

    return this.achievementsService.removeAchievementFromUser(
      achievementId,
      userId,
    );
  }

  // TODO: Create many achievements
  @Post('many')
  createMany(@Body() createAchievementDtos: CreateAchievementDto[]) {
    return this.achievementsService.createMany(createAchievementDtos);
  }
}