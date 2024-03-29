import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievements } from 'src/common/enums/achievements.enum';

@Injectable()
export class AchievementsService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly prismaService: PrismaService) {}

  async onModuleInit() {
    const achievements = await this.findAll();

    if (achievements.length === 0) {
      const defaultAchievements: CreateAchievementDto[] = [
        {
          name: Achievements.VERIFIED,
          description: 'Verify your phone number',
          image: 'verified.png',
        },
        {
          name: Achievements.FIRST_GAME,
          description: 'Play your first game',
          image: 'first-game.png',
        },
        {
          name: Achievements.FIRST_WIN,
          description: 'Win your first game',
          image: 'first-win.png',
        },
        {
          name: Achievements.FIVE_GAMES,
          description: 'Play 10 games',
          image: '5-games.png',
        },
        {
          name: Achievements.FIVE_WINS,
          description: 'Win 10 games',
          image: '5-wins.png',
        },
        {
          name: Achievements.NOOB,
          description: `First log in`,
          image: `noob.png`,
        },
      ];

      await this.createMany(defaultAchievements);
    }
  }

  async onModuleDestroy() {
    await this.prismaService.achievement.deleteMany({});
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

  async giveAchievementsToUserAfterGame(userId: number) {
    const userStats = await this.prismaService.userStats.findUnique({
      where: {
        userId,
      },
      select: {
        exp: true,
        wins: true,
        level: true,
        losses: true,
      },
    });

    if (userStats.wins + userStats.losses === 1) {
      await this.giveAchievementToUser(userId, Achievements.FIRST_GAME);
    }

    if (userStats.wins === 1) {
      await this.giveAchievementToUser(userId, Achievements.FIRST_WIN);
    }

    if (userStats.wins === 5) {
      await this.giveAchievementToUser(userId, Achievements.FIVE_WINS);
    }

    if (userStats.wins + userStats.losses === 5) {
      await this.giveAchievementToUser(userId, Achievements.FIVE_GAMES);
    }

    return userStats;
  }
}
