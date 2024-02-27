import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationDto } from './dto/notification.dto';

@ApiTags('notifications')
@ApiForbiddenResponse({ description: 'Forbidden' })
@UseGuards(AuthGuard)
@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

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

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Notification updated', type: NotificationDto })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiOperation({ summary: 'Mark notification as read' })
  @Get(':id/read')
  async read(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.update(id, {
      read: true,
    });
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Notification updated', type: NotificationDto })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiOperation({ summary: 'Mark notification as unread' })
  @Get(':id/unread')
  async unread(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.update(id, {
      read: false,
    });
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Notification removed' })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiOperation({ summary: 'Remove notification' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.notificationsService.remove(+id);
  }
}
