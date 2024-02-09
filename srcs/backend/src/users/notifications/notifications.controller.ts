import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto';

@ApiTags('notifications')
@ApiForbiddenResponse({ description: 'Forbidden' })
@UseGuards(AuthGuard)
@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiBody({ type: CreateNotificationDto })
  @ApiCreatedResponse({ description: 'Notification created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiOperation({ summary: 'Create notification' })
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @ApiOkResponse({
    description: 'Notification found',
    type: [NotificationDto],
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOperation({ summary: 'Find notification by query' })
  @Get()
  findByQuery(@User() user: UserType, @Query() query: UpdateNotificationDto) {
    return this.notificationsService.findByQuery(user, query);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Notification found', type: NotificationDto })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiOperation({ summary: 'Find notification by id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.findOne(id);
  }

  @Get(':id/read')
  async read(@Param('id', ParseIntPipe) id: number) {
    const notification = await this.notificationsService.findOne(id);

    if (!notification) {
      throw new NotFoundException(`Notification with id <${id}> not found`);
    }

    return this.notificationsService.update(id, {
      read: true,
    });
  }

  @Get(':id/unread')
  async unread(@Param('id', ParseIntPipe) id: number) {
    const notification = await this.notificationsService.findOne(id);

    if (!notification) {
      throw new NotFoundException(`Notification with id <${id}> not found`);
    }

    return this.notificationsService.update(id, {
      read: false,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.notificationsService.remove(+id);
  }
}
