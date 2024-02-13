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
  OnModuleInit,
  HttpCode,
  HttpStatus,
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
  ApiConflictResponse,
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
import { MuteDto } from './dto/mute.dto';

@ApiTags('chat')
@ApiForbiddenResponse({ description: 'Forbidden' })
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller()
export class ChatController implements OnModuleInit {
  constructor(
    private readonly chatService: ChatService,
    private readonly gateway: Gateway,
  ) {}

  async onModuleInit() {
    const mutedUsers = await this.chatService.getMutedUsers();

    mutedUsers.forEach(async (mutedUser) => {
      await this.chatService.setMuteTimeout(mutedUser);
    });
  }

  @ApiBody({ type: CreateChatDto })
  @ApiCreatedResponse({ description: 'Chat created' })
  @ApiConflictResponse({ description: 'Conflict' })
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
    summary: 'Find all chats',
  })
  @ApiOkResponse({ type: [ConversationDto] })
  @Get()
  find() {
    return this.chatService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Find all chats for the logged in user' })
  @ApiOkResponse({ type: [ConversationDto] })
  findUserChats(@User() user: UserType) {
    return this.chatService.findAllChatForUser(user.id);
  }

  @Get('names')
  @ApiOperation({ summary: 'Get chat names' })
  @ApiOkResponse({ type: [String] })
  getChatNames() {
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
  @ApiParam({ name: 'id', description: 'Chat id' })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Conversation not found' })
  @ApiOperation({ summary: 'Find chat by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.findOne(id);
  }

  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
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
  @ApiNotFoundResponse({ description: 'Chat not found' })
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
  @ApiBody({
    description: 'Used id',
    schema: { type: 'object', properties: { userId: { type: 'number' } } },
  })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
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

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({
    description: 'Used id',
    schema: {
      type: 'object',
      properties: { password: { type: 'string' } },
    },
  })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOperation({ summary: 'Join a chat' })
  async joinChat(
    @Param('id', ParseIntPipe) id: number,
    @Body('password') password: string,
    @User() user: UserType,
  ) {
    const chat = await this.chatService.joinChat(+id, user.id, password);

    if (chat) {
      this.gateway.server.to(chat.name).emit('action', {
        action: 'join',
        user: user.id,
        data: chat,
      });
      this.gateway.server.to(`user-${user.id}`).socketsJoin(chat.name);
    }

    return chat;
  }

  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({
    description: 'Used id',
    schema: { type: 'object', properties: { userId: { type: 'number' } } },
  })
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

  @Delete(':id/participants/remove')
  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({
    description: 'Used id',
    schema: { type: 'object', properties: { userId: { type: 'number' } } },
  })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiOperation({ summary: 'Remove a participant from chat' })
  @Roles(Role.OWNER, Role.ADMIN)
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

  @Post(':id/admins/add')
  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({
    description: 'Used id',
    schema: { type: 'object', properties: { userId: { type: 'number' } } },
  })
  @ApiOkResponse({ type: ConversationDto })
  @ApiOperation({ summary: 'Add an admin to chat' })
  @Roles(Role.OWNER, Role.ADMIN)
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

  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({
    description: 'Used id',
    schema: { type: 'object', properties: { userId: { type: 'number' } } },
  })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiOperation({ summary: 'Remove an admin from chat' })
  @Delete(':id/admins/remove')
  @Roles(Role.OWNER, Role.ADMIN)
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
  @Roles(Role.OWNER, Role.ADMIN, Role.USER)
  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiOperation({ summary: 'Leave a chat' })
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

  @Post(':id/ban')
  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({
    description: 'Used id',
    schema: { type: 'object', properties: { userId: { type: 'number' } } },
  })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiOperation({ summary: 'Ban a user from chat' })
  @Roles(Role.OWNER, Role.ADMIN)
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
        data: newChat,
      });
      this.gateway.server.to(`user-${userId}`).socketsLeave(chat.name);
    }

    return newChat;
  }

  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({
    description: 'Used id',
    schema: { type: 'object', properties: { userId: { type: 'number' } } },
  })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiOperation({ summary: 'Unban a user from chat' })
  @Post(':id/unban')
  @Roles(Role.OWNER, Role.ADMIN)
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

  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({
    description: 'Used id',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        duration: { enum: ['MINUTE', 'HOUR', 'DAY'] },
      },
    },
  })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOperation({ summary: 'Mute a user from chat' })
  @Post(':id/mute')
  @Roles(Role.OWNER, Role.ADMIN)
  async mute(@Param('id', ParseIntPipe) id: number, @Body() body: MuteDto) {
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
        data: newChat,
      });

      const mutedUser = newChat.mutedUsers.find((m) => m.user.id === +userId);
      await this.chatService.setMuteTimeout({
        conversationId: +id,
        userId: +userId,
        duration,
        createdAt: mutedUser.createdAt,
      });
    }

    return newChat;
  }

  @Post(':id/unmute')
  @Roles(Role.OWNER, Role.ADMIN, Role.USER) // USER for auto-unmute
  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiBody({
    description: 'Used id',
    schema: { type: 'object', properties: { userId: { type: 'number' } } },
  })
  @ApiOkResponse({ type: ConversationDto })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiOperation({ summary: 'Unmute a user from chat' })
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
  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiOkResponse({ type: [MuteDto] })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiOperation({ summary: 'Find muted users' })
  findMuted(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.findMuted(+id);
  }

  @Get(':id/avatar')
  @ApiParam({ description: 'Chat id', name: 'id', type: Number })
  @ApiOkResponse({ description: 'Chat avatar', type: 'image' })
  @ApiNotFoundResponse({ description: 'Chat not found' })
  @ApiOperation({ summary: 'Get chat avatar' })
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
  @ApiParam({ description: 'User id', name: 'id', type: Number })
  @ApiOkResponse({ type: [ConversationDto] })
  @ApiOperation({ summary: 'Get user chats' })
  getUserChats(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getUserChats(id);
  }
}
