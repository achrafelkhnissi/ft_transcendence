import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { QueryDto } from './dto/query.dto';
import { UsernameDto } from './dto/username.dto';
import { UserType } from 'src/interfaces/user.interface';
import { User } from 'src/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async find(@Query() query: QueryDto, @User() { id: userId }: UserType) {
    const { username: usernameQuery, id: idQuery } = query;

    if (usernameQuery) {
      const user = await this.usersService.findByUsername(usernameQuery);
      return {
        ...user,
        isFriend: await this.usersService.isFriend(userId, user.id),
      };
    }

    if (idQuery) {
      return this.usersService.findById(idQuery);
    }

    return this.usersService.findAll();
  }

  @Patch(':username')
  update(@Param() params: UsernameDto, @Body() updateUserDto: UpdateUserDto) {
    const { username } = params;
    return this.usersService.update(username, updateUserDto);
  }

  @Delete(':username')
  remove(@Param() params: UsernameDto) {
    const { username } = params;
    return this.usersService.remove(username);
  }

  @Get('me')
  getMe(@User() { username }: UserType) {
    return this.usersService.findByUsername(username);
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

  @Get('phoneNumbers')
  getPhoneNumbers() {
    return this.usersService.getPhoneNumbers();
  }

  @Get('usernames')
  getUsernames() {
    return this.usersService.getUsernames();
  }
}
