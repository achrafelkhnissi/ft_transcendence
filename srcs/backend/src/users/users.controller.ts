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
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { QueryDto } from './dto/query.dto';
import { UsernameDto } from './dto/username.dto';
import { UserType } from 'src/common/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
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

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOkResponse({
    type: UpdateUserDto,
    description: 'The user has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiOperation({ summary: 'Update user by id' })
  @ApiBody({ type: UpdateUserDto })
  async updateById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
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
  getRanking(@User() user: UserType) {
    return this.usersService.getRanking(user.id);
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
