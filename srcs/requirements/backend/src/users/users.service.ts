import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
// import { UserResponseDto } from './dto/userResponse.dto';

@Injectable()
export class UsersService {
  // TODO: Check if 'readonly' is needed
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    // TODO: Check if 'Promise<User | null>' is needed
    // return this.prisma.user.findUnique({
    //   where: { email: email },
    // });
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user || null;
  }

  async findByUsername(username: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user || null;
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
