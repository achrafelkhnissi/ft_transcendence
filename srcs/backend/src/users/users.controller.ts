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
<<<<<<< HEAD:srcs/backend/src/users/users.controller.ts
  findAll(@Req() req: Request) {
    // TODO: createa guard to check if user is logged in
    // if (!this.usersService.isLoggedIn())
    // if (!req.user) {
    //   return { message: 'You are not authorized to access this resource' };
    // }
    return this.usersService.findAll();
  }
 
  // @Get(':id')
  // findById(@Param('id') id: string) {
  //   return this.usersService.findById(+id);
  // }
=======
  find(@Query() query: QueryDto) {
    const { username, id } = query;

    if (username) {
      return this.usersService.findByUsername(username);
    }

    if (id) {
      return this.usersService.findById(id);
    }
>>>>>>> origin/backend:srcs/requirements/backend/src/users/users.controller.ts

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
