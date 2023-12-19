import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
  ParseIntPipe,
  // UseGuards,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { AuthGuard } from '../guards/auth.guard';
import { QueryDto } from './dto/query.dto';
import { UsernameDto } from './dto/username.dto';
import { UserType } from 'src/interfaces/user.interface';
import { User } from 'src/decorators/user.decorator';

// @UseGuards(AuthGuard)
@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  find(@Query() query: QueryDto, @User() { id: userId }: UserType) {
    const { username: usernameQuery, id: idQuery } = query;

    if (usernameQuery) {
      return this.usersService.findByUsername(usernameQuery, userId);
    }

    if (idQuery) {
      return this.usersService.findById(idQuery);
    }

    return this.usersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.remove(+id);
  }

  @Get(':username/friends')
  getFriends(@Param() params: UsernameDto) {
    const { username } = params;

    return `This action returns all friends of ${username}`;
  }

  @Get(':username/avatar')
  async getAvatar(@Param() params: UsernameDto, @Res() res) {
    const { username } = params;

    const avatar = await this.usersService.getAvatarByUsername(username);

    if (avatar.startsWith('http')) {
      return res.redirect(avatar);
    }

    return res.sendFile(avatar, { root: './' });
  }

  // FIXME: This route is not working
  // cause: the route is not being called because of the route above
  @Get(':id/avatar')
  async getAvatarById(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const avatar = await this.usersService.getAvatarById(id);

    if (avatar.startsWith('http')) {
      return res.redirect(avatar);
    }

    return res.sendFile(avatar, { root: './' });
  }

  @Get('ranking')
  getRanking() {
    return this.usersService.getRanking();
  }

  @Get(':username/achievements')
  getAchievements(@Param() params: UsernameDto) {
    const { username } = params;

    return this.usersService.getUserAchievements(username);
  }

  @Get(':username/chats')
  getChats(@Param() params: UsernameDto) {
    const { username } = params;

    return this.usersService.getUserChats(username);
  }
}
