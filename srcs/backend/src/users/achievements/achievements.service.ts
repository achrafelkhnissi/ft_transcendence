import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Injectable()
export class AchievementsService implements OnModuleInit {
  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit() {
    const achievements = await this.findAll();

    if (achievements.length === 0) {
      const defaultAchievements: CreateAchievementDto[] = [
        {
          name: 'Verified',
          description: 'Verify your phone number',
          image: 'verified.png',
        },
        {
          name: 'First Game',
          description: 'Play your first game',
          image: 'first-game.png',
        },
        {
          name: 'First Win',
          description: 'Win your first game',
          image: 'first-win.png',
        },
        {
          name: '5 Games',
          description: 'Play 10 games',
          image: '5-games.png',
        },
        {
          name: '5 Wins',
          description: 'Win 10 games',
          image: '5-wins.png',
        },
        {
          name: `Social`,
          description: `Connect with a friend`,
          image: `social.png`,
        },
      ];

      await this.createMany(defaultAchievements);
    }
  }

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
    return this.prismaService.achievement.findUniqueOrThrow({
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
      .findUniqueOrThrow({
        where: {
          id: achievementId,
        },
      })
      .users();
  }

  async giveAchievementToUser(userId: number, achievementName: string) {
    const achievement = await this.findAchievementByName(achievementName);

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    return this.prismaService.achievement.update({
      where: {
        id: achievement.id,
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
      .findUniqueOrThrow({
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
