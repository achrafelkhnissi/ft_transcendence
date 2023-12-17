import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { FriendshipStatus, User } from '@prisma/client';
import { UserResponseDto } from './dto/userResponse.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  // TODO: Check if 'readonly' is needed
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<User> | null {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: number, userId?: number): Promise<UserResponseDto> | null {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`User with id <${id}> not found`);
    }

    // Check if the user is friend with the user making the request
    // TODO: Refactor this so that it's not repeated
    const isFriend = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: user.id,
          },
          {
            senderId: user.id,
            receiverId: userId,
          },
        ],
        friendshipStatus: FriendshipStatus.ACCEPTED,
      },
    });

    return {
      ...user,
      isFriend: isFriend ? isFriend.friendshipStatus : false,
    };
  }

  async findByEmail(
    email: string,
    userId?: number,
  ): Promise<UserResponseDto> | null {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException(`User with email <${email}> not found`);
    }

    // Check if the user is friend with the user making the request
    const isFriend = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: user.id,
          },
          {
            senderId: user.id,
            receiverId: userId,
          },
        ],
        friendshipStatus: FriendshipStatus.ACCEPTED,
      },
    });

    return {
      ...user,
      isFriend: isFriend ? isFriend.friendshipStatus : false,
    };
  }

  async findByUsername(
    username: string,
    userId?: number,
  ): Promise<UserResponseDto> | null {
    const user: User | null = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User with username <${username}> not found`);
    }

    // Check if the user is friend with the user making the request
    const isFriend = await this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: user.id,
          },
          {
            senderId: user.id,
            receiverId: userId,
          },
        ],
        friendshipStatus: FriendshipStatus.ACCEPTED,
      },
    });

    return {
      ...user,
      isFriend: isFriend ? isFriend.friendshipStatus : false,
    };
    // return new UserResponseDto(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto;
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id: id },
    });
  }

  async getAvatar(url: string, accessToken: string): Promise<string> {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    console.log({ data });

    console.log({
      image: data.image,
    });

    const avatar = data.image.link;
    return avatar;
  }

  async getAvatarById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        avatar: true,
      },
    });

    return user?.avatar ?? null;
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
}
