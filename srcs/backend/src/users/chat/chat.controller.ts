import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserType } from 'src/common/interfaces/user.interface';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ConversationDto } from './dto/chat.dto';
import { ConversationType, MuteDuration } from '@prisma/client';
import { Gateway } from 'src/gateway/gateway';

@ApiTags('chat')
@ApiForbiddenResponse({ description: 'Forbidden' })
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly gateway: Gateway,
  ) {}

  @ApiBody({ type: CreateChatDto })
  @ApiCreatedResponse({ description: 'Chat created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOperation({ summary: 'Create a chat' })
  @Post()
  async create(@User() user: UserType, @Body() createChatDto: CreateChatDto) {
    const { type, participants } = createChatDto;

    if (type == ConversationType.DM && participants.length === 1) {
      participants.push(user.id);
      const sortedIds = participants.sort();
      createChatDto.name = `Room${sortedIds[0]}-${sortedIds[1]}`;
    } else {
      createChatDto.ownerId = user.id;

      if (!createChatDto.image || createChatDto.image === '') {
        const avatar = `uploads/chat-default-images/chat-image-${Math.floor(
          Math.random() * 6 + 1,
        )}.jpg`;

        createChatDto.image = avatar;
      }
    }

    const chat = await this.chatService.create(createChatDto);

    if (chat) {
      participants.forEach((id) => {
        const userRoomName = `user-${id}`;
        this.gateway.server.to(userRoomName).socketsJoin(chat.name);
      });
      this.gateway.server.to(`user-${user.id}`).socketsJoin(chat.name);
      this.gateway.server.to(chat.name).emit('action', {
        action: 'add',
        user: user.id,
        data: chat,
      });
      this.gateway.server.to(chat.name).emit('notification', {});
    }

    return chat;
  }

  @ApiOperation({
    summary: 'Find all chats for the logged in user',
  })
  @ApiOkResponse({ type: [ConversationDto] })
  @Get()
  find(@User() user: UserType) {
    return this.chatService.findAllChatForUser(user.id);
  }

  @Get('names')
  @ApiOperation({ summary: 'Get chat names' })
  @ApiOkResponse({ type: [String] })
  getChatNames() {
    console.log('Getting chat names in ChatController');
    return this.chatService.getChatNames();
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular chats' })
  @ApiOkResponse({
    description: 'Gets the top 4 popular channels',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          type: { enum: ['DM', 'PUBLIC', 'PRIVATE', 'PROTECTED'] },
          name: { type: 'string' },
          image: { type: 'string' },
          _count: {
            type: 'object',
            properties: {
              participants: { type: 'number' },
              admins: { type: 'number' },
            },
          },
        },
      },
    },
  })
  getPopularChats() {
    return this.chatService.getPopularChats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('ChatController.findOne id:', id);
    return this.chatService.findOne(id);
  }

  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiOkResponse({ type: ConversationDto })
  @ApiOperation({ summary: 'Update a chat' })
  @Roles(Role.OWNER)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChatDto: UpdateChatDto,
    @User() user: UserType,
  ) {
    const chat = await this.chatService.update(+id, updateChatDto);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'update',
        user: user.id,
        data: chat,
      });
    }

    return chat;
  }

  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiOkResponse({ type: ConversationDto })
  @ApiOperation({ summary: 'Remove a chat' })
  @Roles(Role.OWNER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const chat = await this.chatService.remove(+id);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'delete',
        user: chat.ownerId,
        data: chat,
      });
    }

    return chat;
  }

  @Delete(`:id/remove`)
  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({ description: 'Used id' })
  @ApiOkResponse({ type: ConversationDto })
  @ApiOperation({ summary: 'Remove a user from chat' })
  @Roles(Role.OWNER)
  async removeUser(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    const chat = await this.chatService.removeUser(id, userId);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'remove',
        user: userId,
        data: chat,
      });
      this.gateway.server.to(`user-${userId}`).socketsLeave(chat.name);
    }

    return chat;
  }

  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({ type: UpdateChatDto })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOperation({ summary: 'Find a chat by id' })
  @Post(':id/participants/add')
  async addParticipant(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    const chat = await this.chatService.addParticipant(+id, +userId);

    if (chat) {
      this.gateway.server.to(`user-${userId}`).socketsJoin(chat.name);
      this.gateway.server.to(chat.name).emit('action', {
        action: 'add',
        user: userId,
        data: chat,
      });
    }

    return chat;
  }

  @Roles(Role.OWNER, Role.ADMIN)
  @Delete(':id/participants/remove')
  async removeParticipant(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    const chat = await this.chatService.removeParticipant(+id, +userId);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'remove',
        user: userId,
        data: chat,
      });
      this.gateway.server.to(`user-${userId}`).socketsLeave(chat.name);
    }

    return chat;
  }

  @Roles(Role.OWNER, Role.ADMIN)
  @Post(':id/admins/add')
  async addAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    const chat = await this.chatService.addAdmin(+id, +userId);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'add-admin',
        user: userId,
        data: chat,
      });
    }

    return chat;
  }

  @Roles(Role.OWNER, Role.ADMIN)
  @Delete(':id/admins/remove')
  async removeAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    const chat = await this.chatService.removeAdmin(+id, +userId);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'remove-admin',
        user: userId,
        data: chat,
      });
      this.gateway.server.to(`user-${userId}`).socketsLeave(chat.name);
    }

    return chat;
  }

  @Post(':id/leave')
  async leaveChat(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserType,
  ) {
    const chat = await this.chatService.leaveChat(+id, user.id);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'leave',
        user: user.id,
        data: chat,
      });
      this.gateway.server.to(`user-${user.id}`).socketsLeave(chat.name);
    }

    return chat;
  }

  @Roles(Role.OWNER, Role.ADMIN)
  @Post(':id/ban')
  async ban(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    const chat = await this.chatService.findOne(+id);

    if (chat.ownerId === +userId) {
      throw new ForbiddenException('You cannot ban the owner of the chat');
    }

    const admins = chat.admins.map((admin) => admin.id);
    if (admins.includes(+userId)) {
      return this.chatService.ban(+id, +userId, Role.ADMIN);
    }

    const newChat = await this.chatService.ban(+id, +userId, Role.USER);

    if (newChat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'ban',
        user: userId,
        data: chat,
      });
      this.gateway.server.to(`user-${userId}`).socketsLeave(chat.name);
    }

    return newChat;
  }

  @Roles(Role.OWNER, Role.ADMIN)
  @Post(':id/unban')
  async unban(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId') userId: string,
  ) {
    const chat = await this.chatService.unban(+id, +userId);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'unban',
        user: userId,
        data: chat,
      });
    }

    return chat;
  }

  @Roles(Role.OWNER, Role.ADMIN)
  @Post(':id/mute')
  async mute(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: string; duration: MuteDuration }, // CreateMuteDto
  ) {
    const { userId, duration } = body;

    const chat = await this.chatService.findOne(+id);
    if (chat.ownerId === +userId) {
      throw new ForbiddenException('You cannot mute the owner of the chat');
    }

    const newChat = await this.chatService.mute(+id, +userId, duration);

    if (newChat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'mute',
        user: userId,
        data: chat,
      });
    }

    return newChat;
  }

  @Roles(Role.OWNER, Role.ADMIN)
  @Post(':id/unmute')
  async unmute(
    @Param('id', ParseIntPipe)
    id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    const chat = await this.chatService.unmute(id, userId);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'unmute',
        user: userId,
        data: chat,
      });
    }

    return chat;
  }

  @Get(':id/muted')
  findMuted(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.findMuted(+id);
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const avatar = await this.chatService.getAvatar(+id);

    if (avatar && avatar.startsWith('http')) {
      return res.redirect(avatar);
    }

    return res.sendFile(avatar, { root: './' });
  }

  // @Get(':id/messages')
  // findMessages(@Param('id', ParseIntPipe) id: number) {
  //   return this.chatService.findMessages(+id);
  // }

  // @Get(':id/participants')
  // findParticipants(@Param('id', ParseIntPipe) id: number) {
  //   return this.chatService.findParticipants(+id);
  // }

  // @Get(':id/admins')
  // findAdmins(@Param('id', ParseIntPipe) id: number) {
  //   return this.chatService.findAdmins(+id);
  // }

  // @Get(':id/owner')
  // findOwner(@Param('id', ParseIntPipe) id: number) {
  //   return this.chatService.findOwner(+id);
  // }

  @Get(':id/chats')
  getUserChats(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getUserChats(id);
  }
}
