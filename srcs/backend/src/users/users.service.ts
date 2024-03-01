import { FriendsService } from './friends/friends.service';
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

  async findAll(id: number) {
    const blockedUsers = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            sender: {
              id,
            },
          },
          {
            receiver: {
              id,
            },
          },
        ],
        friendshipStatus: 'BLOCKED',
      },
      select: {
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    const blockedUserIds = [
      ...new Set(
        blockedUsers.flatMap((req) => [req.sender.id, req.receiver.id]),
      ),
    ];

    return this.prisma.user.findMany({
      where: {
        id: {
          notIn: blockedUserIds,
        },
      },
      select: {
        id: true,
        username: true,
        status: true,
        email: true,
      },
    });
  }

  async findById(id: number, userId?: number) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: id },
      select: {
        id: true,
        username: true,
        phoneNumber: true,
        avatar: true,
        url: true,
        status: true,
        email: true,
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
        email: true,
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
    const blockedUsers = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            sender: {
              username,
            },
          },
          {
            receiver: {
              username,
            },
          },
        ],
        friendshipStatus: 'BLOCKED',
      },
      select: {
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    // .then((friendRequests) => {
    //   return friendRequests.map((req) =>
    //     username === req.receiver.username ? req.sender : req.receiver,
    //   );
    // });

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { username },
      select: {
        id: true,
        username: true,
        phoneNumber: true,
        avatar: true,
        url: true,
        status: true,
        email: true,
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
      friends: await this.friendsService.listFriendsById(user.id),
      games: await this.getGames(user.id),
      blockedUsers,
    };
  }

  update(userId: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateUserDto,
        settings: {
          update: updateUserDto.settings,
        },
      },
    });
  }

  remove(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
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

  async getAvatarById(userId: number) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        avatar: true,
      },
    });

    return user?.avatar ?? null;
  }

  async getRanking(userId: number) {
    const blockedUsers = await this.prisma.friendRequest
      .findMany({
        where: {
          OR: [
            {
              senderId: userId,
            },
            {
              receiverId: userId,
            },
          ],
          friendshipStatus: 'BLOCKED',
        },
        select: {
          senderId: true,
          receiverId: true,
        },
      })
      .then((blockedUsers) => {
        return blockedUsers
          .map((user) =>
            user.senderId === userId ? user.receiverId : user.senderId,
          )
          .filter((id) => id !== userId);
      });

    return this.prisma.userStats
      .findMany({
        where: {
          userId: {
            notIn: blockedUsers,
          },
        },
        select: {
          user: {
            select: {
              id: true,
              avatar: true,
              username: true,
              email: true,
              stats: {
                select: {
                  level: true,
                  wins: true,
                  losses: true,
                },
              },
            },
          },
          level: true,
          wins: true,
          losses: true,
        },
        orderBy: [
          {
            level: 'desc',
          },
          {
            wins: 'desc',
          },
          {
            losses: 'asc',
          },
        ],
      })
      .then((users) => {
        return users.map((user) => {
          return {
            ...user.user,
            stats: {
              level: user.level,
              wins: user.wins,
              losses: user.losses,
            },
          };
        });
      });
  }

  getUserChats(username: string) {
    const userInfoSelect = {
      id: true,
      username: true,
      avatar: true,
      status: true,
      email: true,
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
              readBy: true,
              createdAt: true,
              sender: {
                select: userInfoSelect,
              },
            },
          },
        },
      })
      .catch((error) => {
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

  async getUsernamesFromIds(ids: number[]): Promise<string[]> {
    return this.prisma.user
      .findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: {
          username: true,
        },
      })
      .then((users) => users.map((user) => user.username));
  }

  async getGames(userId: number) {
    return this.prisma.game.findMany({
      where: {
        OR: [
          {
            winnerId: userId,
          },
          {
            loserId: userId,
          },
        ],
      },
      select: {
        id: true,
        winner: {
          select: {
            id: true,
            username: true,
          },
        },
        loser: {
          select: {
            id: true,
            username: true,
          },
        },
        score: true,
      },
    });
  }
}
