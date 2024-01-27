import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor(private readonly prismaService: PrismaService) {}

  uploadUserAvatar(userId: number, image: Express.Multer.File) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: image.path,
      },
    });
  }

  uploadChannelAvatar(image: Express.Multer.File) {
    return image.path;
  }
}
