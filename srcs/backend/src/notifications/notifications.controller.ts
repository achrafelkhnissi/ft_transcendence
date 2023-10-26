import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Sse,
  Logger,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Observable, interval, map } from 'rxjs';
import { Notification, NotificationType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/guards/auth.guard';

// @UseGuards(AuthGuard)
@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly prismaService: PrismaService,
  ) {}

  // @Sse('sse')
  // sendNotification(): Observable<Notification> {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    console.log({
      createNotificationDto,
    });

    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
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
    return this.notificationsService.remove(+id);
  }
}
