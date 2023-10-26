import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  // private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly prismaService: PrismaService) {}

  create(createNotificationDto: CreateNotificationDto) {
    return this.prismaService.notification.create({
      data: createNotificationDto,
    });
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return this.prismaService.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  findAll() {
    return this.prismaService.notification.findMany();
  }

  findOne(id: number) {
    return this.prismaService.notification.findUnique({
      where: { id },
    });
  }

  findByRecipientId(recipientId: number) {
    return this.prismaService.notification.findMany({
      where: { recipientId },
    });
  }

  remove(id: number) {
    return this.prismaService.notification.delete({
      where: { id },
    });
  }
}
