import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createAchievementDto: CreateAchievementDto) {
    return this.prismaService.achievement.create({
      data: createAchievementDto,
    });
  }

  createMany(createAchievementDtos: CreateAchievementDto[]) {
    return this.prismaService.achievement.createMany({
      data: createAchievementDtos,
    });
  }

  findAll() {
    return this.prismaService.achievement.findMany();
  }

  findOne(id: number) {
    return this.prismaService.achievement.findUnique({
      where: {
        id,
      },
    });
  }

  findAchievementByName(name: string) {
    return this.prismaService.achievement.findFirst({
      where: {
        name,
      },
    });
  }

  update(id: number, updateAchievementDto: UpdateAchievementDto) {
    return this.prismaService.achievement.update({
      where: {
        id,
      },
      data: updateAchievementDto,
    });
  }

  remove(id: number) {
    return this.prismaService.achievement.delete({
      where: {
        id,
      },
    });
  }

  getAchievementUsers(achievementId: number) {
    return this.prismaService.achievement
      .findUnique({
        where: {
          id: achievementId,
        },
      })
      .users();
  }

  giveAchievementToUser(achievementId: number, userId: number) {
    return this.prismaService.achievement.update({
      where: {
        id: achievementId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  removeAchievementFromUser(achievementId: number, userId: number) {
    return this.prismaService.achievement.update({
      where: {
        id: achievementId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  getUserAchievementsByUsername(username: string) {
    return this.prismaService.user
      .findUnique({
        where: {
          username,
        },
      })
      .achievements({
        select: {
          name: true,
          description: true,
          image: true,
        },
      });
  }
}
