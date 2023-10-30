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
  UseGuards,
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
}
