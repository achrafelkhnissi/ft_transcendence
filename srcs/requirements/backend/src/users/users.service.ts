import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  // TODO: Check if 'readonly' is needed
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    createUserDto;
    return 'This action adds a new user';
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
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
