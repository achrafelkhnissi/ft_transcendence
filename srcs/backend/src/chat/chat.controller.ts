import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from 'src/decorators/user.decorator';
// import { AuthGuard } from 'src/guards/auth.guard';

/**
 * TODO:
 * - Add guards to routes
 * - Add the ability to change access type of chat [public, private, protected]
 * - What should happen if the owner of a chat leaves the chat?
 * - The owner should be able to change the password of a chat
 * - Channel owner should be able to kick, ban, mute, etc. users
 */

// @UseGuards(AuthGuard)
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@User() user, @Body() createChatDto: CreateChatDto) {
    // TODO: add user as owner of chat
    return this.chatService.create(createChatDto);
  }

  @Get()
  findAll(@User() user) {
    if (user) {
      return this.chatService.findAllChatForUser(user.id);
    }

    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  // TODO: Check if we can add an admin to a chat using this endpoint or if we need a separate endpoint
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
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

  // Remove a user from a chat
  @Delete(':id/users/:userId')
  removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.chatService.removeUser(+id, +userId);
  }

  @Delete(':id/admins/:userId')
  removeAdmin(@Param('id') id: string, @Param('userId') userId: string) {
    return this.chatService.removeAdmin(+id, +userId);
  }
}
