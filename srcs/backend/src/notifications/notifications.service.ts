import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  // private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly prismaService: PrismaService) {}

  create(createNotificationDto: CreateNotificationDto) {
    return this.prismaService.notification.create({
      data: createNotificationDto,
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
