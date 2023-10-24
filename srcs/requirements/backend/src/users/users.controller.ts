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
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsernameDto } from './dto/username.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  findByEmail(@Param(ValidationPipe) params: UsernameDto) {
    const { username } = params;

    return this.usersService.findByUsername(username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.remove(+id);
  }

  // Friends routes
  // TODO: Move to friends module.

  @Get('friends/add')
  async sendFriendRequest(
    @Query() query: { username: string },
    // @Req() req: Request,
    @User() user: UserType,
  ) {
    const senderId = user?.id;
    const receiverUsername = query.username;

    this.logger.log(
      `User <${user?.username}> is adding user <${receiverUsername}> as a friend`,
    );

    return this.usersService.sendFriendRequest(senderId, receiverUsername);
  }

  @Get('friends/accept')
  async acceptFriendRequest(
    @Query() query: { username: string },
    // @Req() req: Request,
    @User() user: UserType,
  ) {
    const senderId = user?.id;
    const receiverUsername = query.username;

    this.logger.log(
      `User <${user?.username}> is accepting a friend request from user <${receiverUsername}>`,
    );

    return this.usersService.acceptFriendRequest(senderId, receiverUsername);
  }

  @Get('friends/decline')
  async declineFriendRequest(
    @Query() query: { username: string },
    // @Req() req: Request,
    @User() user: UserType,
  ) {
    const senderId = user?.id;
    const receiverUsername = query.username;

    this.logger.log(
      `User <${user?.username}> is rejecting a friend request from user <${receiverUsername}>`,
    );

    return this.usersService.declineFriendRequest(senderId, receiverUsername);
  }

  @Post('friends/list')
  async listFriends(@Body() body: { username: string }) {
    this.logger.log(`Listing friends of user <${body.username}>`);
    return this.usersService.listFriends(body.username);
  }

  // TODO: Test this after merging with the frontend
  // If it works, remove the other listFriends route
  @Get('friends/list')
  async listFriends2(@User() user: UserType) {
    this.logger.log(`Listing friends of user <${user?.username}>`);
    return this.usersService.listFriends(user?.username);
  }

  @Get('friends/remove')
  async removeFriend(
    @Query() query: { username: string },
    // @Req() req: Request,
    @User() user: UserType,
  ) {
    const userId = user?.id;
    const friendUsername = query.username;

    this.logger.log(
      `User <${user?.username}> is removing user <${friendUsername}> as a friend`,
    );

    return this.usersService.removeFriend(userId, friendUsername);
  }
}
