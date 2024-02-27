import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class GatewayService {
  constructor(private readonly prisma: PrismaService
    ) {}

  async getRoomsByUserId(userId: number): Promise<string[]> {
    return this.prisma.conversation
      .findMany({
        where: {
          OR: [
            {
              participants: {
                some: {
                  id: userId,
                },
              },
            },
            {
              admins: {
                some: {
                  id: userId,
                },
              },
            },
            {
              ownerId: userId,
            },
          ],
        },
      })
      .then((rooms) => rooms.map((room) => room.name));
  }

  async toggleUserStatus(userId: number, status: Status): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status,
      },
    });
  }
}
