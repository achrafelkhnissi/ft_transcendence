import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { editFileName } from 'src/common/utils/edit-file-name';
import { imageFileFilter } from 'src/common/utils/image-file-filter';

@UseGuards(AuthGuard)
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
      fileFilter: imageFileFilter,
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
    this.logger.debug(`Uploading avatar for user ${user.id}`);
    return this.uploadService.uploadAvatar(user.id, image);
  }
}
