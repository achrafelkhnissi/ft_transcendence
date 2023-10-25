import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { User } from '@prisma/client';

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

  async findById(id: number): Promise<User> | null {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`User with id <${id}> not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> | null {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException(`User with email <${email}> not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> | null {
    const user: User | null = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User with username <${username}> not found`);
    }
    return user;
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
}
