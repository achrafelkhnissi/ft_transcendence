import { Controller, Post, Logger, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UploadedFileValidator } from './utils/UploadedFileValidator';
import {
  ChannelAvatarUploadInterceptor,
  UserAvatarUploadInterceptor,
} from './utils/UploadInterceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('upload')
@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  private readonly logger = new Logger(UploadController.name);

  @Post('avatar')
  @UserAvatarUploadInterceptor()
  uploadAvatar(
    @UploadedFileValidator() image: Express.Multer.File,
    @User() user: UserType,
  ) {
    this.logger.debug(`Uploading avatar for user ${user.id}`);
    return this.uploadService.uploadUserAvatar(user.id, image);
  }

  @Post('channel-avatar')
  @ChannelAvatarUploadInterceptor()
  uploadChannelAvatar(@UploadedFileValidator() image: Express.Multer.File) {
    return this.uploadService.uploadChannelAvatar(image);
  }
}
