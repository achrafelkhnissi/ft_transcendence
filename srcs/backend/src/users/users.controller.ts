import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
  ParseIntPipe,
  HttpStatus,
  SerializeOptions,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { UserType } from 'src/common/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { QueryDto } from './dto/query.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@ApiForbiddenResponse({
  description: 'Forbidden',
})
@UseGuards(AuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Users have been successfully found.',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOperation({ summary: 'Find users by username or id' })
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
      const user = await this.usersService.findById(idQuery, userId);
      return {
        ...user,
        isFriend: await this.usersService.isFriend(userId, user.id),
      };
    }

    throw new NotFoundException('User not found');
  }

  @Get('all')
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          username: { type: 'string' },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get all users' })
  findAll(@User() { id: userId }: UserType) {
    return this.usersService.findAll(userId);
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
  @ApiForbiddenResponse({
    description: 'You can not update other users',
  })
  @ApiOperation({ summary: 'Update user by id' })
  async updateById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User() { id: userId }: UserType,
  ) {
    if (id !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserDto);
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

  @Get(':id/avatar')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOkResponse({
    description: 'The user avatar has been successfully found.',
  })
  @ApiNotFoundResponse({
    description: 'Avatar not found',
  })
  @ApiOperation({ summary: 'Get user avatar by id' })
  @SerializeOptions({ strategy: 'excludeAll' })
  async getAvatar(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() res: Response,
  ) {
    const avatar = await this.usersService.getAvatarById(id);

    if (!avatar) {
      return res.status(HttpStatus.NOT_FOUND).send('Avatar not found');
    }

    if (avatar.startsWith('http')) {
      return res.redirect(avatar);
    }

    return res.sendFile(avatar, { root: './' });
  }

  @ApiOkResponse({
    type: [UpdateUserDto],
    description: 'Ranking has been successfully displayed.',
  })
  @ApiOperation({ summary: 'Get ranking' })
  @Get('ranking')
  getRanking(@User() user: UserType) {
    return this.usersService.getRanking(user.id);
  }

  @Get('phoneNumbers')
  @ApiOkResponse({
    description: 'Phone numbers have been successfully displayed.',
  })
  @ApiOperation({ summary: 'Get phone numbers' })
  getPhoneNumbers() {
    return this.usersService.getPhoneNumbers();
  }

  @Get('usernames')
  @ApiOkResponse({
    description: 'Usernames have been successfully displayed.',
  })
  @ApiOperation({ summary: 'Get all usernames' })
  getUsernames() {
    return this.usersService.getUsernames();
  }
}
