import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Logger,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';
import { Request } from 'express';
import * as path from 'path';

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  // const originalName = path.parse(file.originalname).name;
  // const filename = Date.now() + '-' + originalName + '.jpg'; // TODO: Check if .webp is better

  const originalName = file.originalname.split('.')[0];
  const fileExtName = path.extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  const filename = `${originalName}-${randomName}${fileExtName}`;

  Logger.debug(`Renaming ${file.originalname} to ${filename}`);

  callback(null, filename);
};

// TODO: Add AuthGuard
// TODO: Check if the route need to be under /users or not!
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  private readonly logger = new Logger(UploadController.name);

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2MB
            message: 'File too large',
          }),
          new FileTypeValidator({
            fileType: 'jpeg|jpg|png',
          }),
        ],
      }),
    )
    image: Express.Multer.File,
    @User() user: UserType,
  ) {
    const userId = user?.id ?? 1; // TODO: Remove this default value

    this.logger.log(`Uploading avatar for user ${userId}`);
    return this.uploadService.uploadAvatar(userId, image);
  }
}
