import { FriendsService } from './../friends/friends.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly friendsService: FriendsService,
  ) {}

  async isFriend(userId: number, friendId: number) {
    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: friendId,
          },
          {
            senderId: friendId,
            receiverId: userId,
          },
        ],
      },
      select: {
        friendshipStatus: true,
      },
    });

    return friendRequest ? friendRequest.friendshipStatus : false;
  }

  async me(username: string) {
    return this.findByUsername(username);
  }

  create(createUserDto: CreateUserDto): Promise<User> | null {
    this.logger.log(`creating user ${createUserDto.username}`);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        stats: {
          create: {},
        },
        settings: {
          create: {},
        },
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: number, userId?: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        phoneNumber: true,
        avatar: true,
        url: true,
        status: true,
        // stats: {
        //   select: {
        //     exp: true,
        //     level: true,
        //     wins: true,
        //     losses: true,
        //   },
        // },
        // achievements: {
        //   select: {
        //     name: true,
        //     description: true,
        //     image: true,
        //   },
        // },
        settings: {
          select: {
            twoFactorEnabled: true,
            verified: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id <${id}> not found`);
    }

    return {
      ...user,
      isFriend: await this.isFriend(userId, id),
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
      select: {
        id: true,
        username: true,
        phoneNumber: true,
        avatar: true,
        url: true,
        status: true,
        // stats: {
        //   select: {
        //     exp: true,
        //     level: true,
        //     wins: true,
        //     losses: true,
        //   },
        // },
        // achievements: {
        //   select: {
        //     name: true,
        //     description: true,
        //     image: true,
        //   },
        // },
        settings: {
          select: {
            twoFactorEnabled: true,
            verified: true,
          },
        },
      },
    });
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        phoneNumber: true,
        avatar: true,
        url: true,
        status: true,
        stats: {
          select: {
            exp: true,
            level: true,
            wins: true,
            losses: true,
          },
        },
        achievements: {
          select: {
            name: true,
            description: true,
            image: true,
          },
        },
        settings: {
          select: {
            twoFactorEnabled: true,
            verified: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with username <${username}> not found`);
    }

    return {
      ...user,
      friends: await this.friendsService.listFriendsByUsername(username),
    };
  }

  update(username: string, updateUserDto: UpdateUserDto) {
    this.logger.debug(`updating user ${username}`);
    return this.prisma.user.update({
      where: { username },
      data: updateUserDto,
    });
  }

  remove(username: string) {
    this.logger.debug(`deleting user ${username}`);
    return this.prisma.user.delete({
      where: { username },
    });
  }

  async getAvatarFrom42API(url: string, accessToken: string): Promise<string> {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    const avatar = data.image.link;
    return avatar;
  }

  async getAvatarByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        avatar: true,
      },
    });

    return user?.avatar ?? null;
  }

  getRanking() {
    return this.prisma.user.findMany({
      orderBy: {
        stats: {
          level: 'desc',
        },
      },
      select: {
        avatar: true,
        username: true,
        stats: {
          select: {
            level: true,
            wins: true,
            losses: true,
          },
        },
      },
    });
  }

  getUserChats(username: string) {
    const userInfoSelect = {
      username: true,
      avatar: true,
      status: true,
    };

    return this.prisma.conversation
      .findMany({
        where: {
          OR: [
            {
              participants: {
                some: {
                  username,
                },
              },
            },
            {
              admins: {
                some: {
                  username,
                },
              },
            },
            {
              owner: {
                username,
              },
            },
          ],
        },
        select: {
          id: true,
          type: true,
          updatedAt: true,
          owner: {
            select: userInfoSelect,
          },
          participants: {
            select: userInfoSelect,
          },
          admins: {
            select: userInfoSelect,
          },
          messages: {
            select: {
              id: true,
              content: true,
              isRead: true,
              createdAt: true,
              sender: {
                select: userInfoSelect,
              },
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error);
        throw new NotFoundException(`User <${username}> not found`);
      });
  }

  getPhoneNumbers() {
    return this.prisma.user.findMany({
      where: {
        phoneNumber: {
          not: null,
        },
      },
      select: {
        phoneNumber: true,
      },
    });
  }

  getUsernames() {
    return this.prisma.user.findMany({
      select: {
        username: true,
      },
    });
  }
}
