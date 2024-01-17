import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserType } from 'src/interfaces/user.interface';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  private readonly infoToSelect = {
    id: true,
    read: true,
    type: true,
    sender: {
      select: {
        username: true,
        avatar: true,
      },
    },
  };

  constructor(private readonly prismaService: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = await this.prismaService.notification.create({
        data: createNotificationDto,
      });

      return notification;
    } catch (error) {
      this.logger.warn(
        "Couldn't create notification because its already exists in the database",
      );
    }

    return null;
  }

  findByQuery(user: UserType, query: UpdateNotificationDto) {
    if (query) {
      return this.prismaService.notification.findMany({
        where: query,
        select: this.infoToSelect,
      });
    }

    return this.findOne(user.id);
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return this.prismaService.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  findOne(id: number) {
    return this.prismaService.notification.findUnique({
      where: { id },
      select: this.infoToSelect,
    });
  }

  remove(id: number) {
    return this.prismaService.notification.delete({
      where: { id },
    });
  }
}
