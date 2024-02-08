import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsernameDto } from 'src/users/dto/username.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserType } from 'src/common/interfaces/user.interface';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

/**
 * TODO:
 * - Add guards to routes
 * - Add the ability to change access type of chat [public, private, protected]
 * - What should happen if the owner of a chat leaves the chat?
 * - The owner should be able to change the password of a chat
 * - Channel owner should be able to kick, ban, mute, etc. users
 */

@ApiTags('chat')
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@User() user: UserType, @Body() createChatDto: CreateChatDto) {
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (createChatDto.type != 'DM') {
      createChatDto.ownerId = user.id;
    }

    return this.chatService.create(createChatDto);
  }

  @Get()
  findAll(@User() user: UserType, @Query('id') id: string) {
    if (id) {
      return this.chatService.findOne(+id);
    }

    return this.chatService.findAllChatForUser(user.id);
  }

  // Check if we can add an admin to a chat using this endpoint or if we need a separate endpoint
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  // only the owner of the chat should be able to delete it
  @Delete(':id')
  @Roles(Role.OWNER)
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }

  @Post(':id/participants/add')
  addParticipant(@Param('id') id: string, @Body('userId') userId: string) {
    return this.chatService.addParticipant(+id, +userId);
  }

  @Roles(Role.OWNER)
  @Roles(Role.ADMIN)
  @Post(':id/participants/remove')
  removeParticipant(@Param('id') id: string, @Body('userId') userId: string) {
    return this.chatService.removeParticipant(+id, +userId);
  }

  @Post(':id/leave')
  leaveChat(@Param('id') id: string, @User() user: UserType) {
    return this.chatService.leaveChat(+id, user.id);
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string, @Res() res: Response) {
    const avatar = await this.chatService.getAvatar(+id);

    if (avatar && avatar.startsWith('http')) {
      return res.redirect(avatar);
    }

    return res.sendFile(avatar, { root: './' });
  }

  @Get(':id/messages')
  findMessages(@Param('id') id: string) {
    return this.chatService.findMessages(+id);
  }

  @Get(':id/participants')
  findParticipants(@Param('id') id: string) {
    return this.chatService.findParticipants(+id);
  }

  @Get(':id/admins')
  findAdmins(@Param('id') id: string) {
    return this.chatService.findAdmins(+id);
  }

  @Get(':id/owner')
  findOwner(@Param('id') id: string) {
    return this.chatService.findOwner(+id);
  }

  @Post(':id/admins')
  addAdmin(@Param('id') id: string, @Body() userId: number) {
    return this.chatService.addAdmin(+id, userId);
  }

  @Delete(':id/admins/:userId')
  removeAdmin(@Param('id') id: string, @Param('userId') userId: string) {
    return this.chatService.removeAdmin(+id, +userId);
  }

  @Get(':username/chats')
  getUserChats(@Param() param: UsernameDto) {
    const { username } = param;

    console.log(
      `Finding chats for user with username ${username} in ChatController`,
    );

    return this.chatService.getUserChats(username);
  }

  @Get('names')
  getChatNames() {
    console.log('Getting chat names in ChatController');
    return this.chatService.getChatNames();
  }
}
