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
import { UsernameDto } from './dto/username.dto';
import { UserType } from 'src/common/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@UseGuards(AuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({
    type: CreateUserDto,
    description: 'Create user',
    required: true,
  })
  @ApiOkResponse({
    type: CreateUserDto,
    description: 'The user has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  @ApiOperation({ summary: 'Create user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // async find(@Query() query: QueryDto, @User() { id: userId }: UserType) {
  //   const { username: usernameQuery, id: idQuery } = query;

  //   if (usernameQuery) {
  //     const user = await this.usersService.findByUsername(usernameQuery);
  //     return {
  //       ...user,
  //       isFriend: await this.usersService.isFriend(userId, user.id),
  //     };
  //   }

  //   if (idQuery) {
  //     return this.usersService.findById(idQuery);
  //   }

  //   return this.usersService.findAll();
  // }

  @ApiQuery({
    name: 'id',
    type: Number,
    required: false,
    description: 'User id',
  })
  @ApiOkResponse({
    type: [UpdateUserDto],
    description: 'The user has been successfully found.',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiOperation({ summary: 'Find user by id or all users' })
  @Get()
  async find(@Query('id') id?: number) {
    if (id) {
      return this.usersService.findById(id);
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
  async updateById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOkResponse({
    type: UpdateUserDto,
    description: 'The user has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiOperation({ summary: 'Delete user by id' })
  delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.remove(id);
  }

  @Get('me')
  @ApiOkResponse({
    type: UpdateUserDto,
    description: 'The current user has been successfully found.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiOperation({ summary: 'Get the current user' })
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
