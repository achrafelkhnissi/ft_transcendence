import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Sse,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Observable, fromEvent, map } from 'rxjs';
import { Notification } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';

@UseGuards(AuthGuard)
@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Sse('sse')
  sendNotification(): Observable<Notification> | any {
    return fromEvent(this.eventEmitter, 'notification').pipe(
      map((data: Notification) => data),
    );
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    console.log({
      createNotificationDto,
    });

    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findByQuery(@User() user: UserType, @Query() query: UpdateNotificationDto) {
    return this.notificationsService.findByQuery(user, query);
  }

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
    this.logger.error(`Delete notif ${id}`);
    return this.notificationsService.remove(+id);
  }
}
