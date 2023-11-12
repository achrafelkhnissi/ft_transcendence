import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserType } from 'src/interfaces/user.interface';

@Injectable()
export class NotificationsService {
  // private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly prismaService: PrismaService) {}

  create(createNotificationDto: CreateNotificationDto) {
    return this.prismaService.notification.create({
      data: createNotificationDto,
    });
  }

  findByQuery(user: UserType, query: UpdateNotificationDto) {
    if (query) {
      return this.prismaService.notification.findMany({
        where: query,
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
    });
  }

  remove(id: number) {
    return this.prismaService.notification.delete({
      where: { id },
    });
  }
}
