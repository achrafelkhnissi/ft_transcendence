import { Controller, Post, Logger, UseGuards, Body } from '@nestjs/common';
import { UploadService } from './upload.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UploadedFileValidator } from './utils/UploadedFileValidator';
import { UploadInterceptor } from './utils/UploadInterceptor';

@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  private readonly logger = new Logger(UploadController.name);

  @Post('avatar')
  @UploadInterceptor()
  uploadAvatar(
    @UploadedFileValidator() image: Express.Multer.File,
    @User() user: UserType,
  ) {
    this.logger.debug(`Uploading avatar for user ${user.id}`);
    return this.uploadService.uploadAvatar(user.id, image);
  }

  @Post('channel-avatar')
  @UploadInterceptor()
  uploadChannelAvatar(
    @UploadedFileValidator() image: Express.Multer.File,
    @Body('channelId') channelId: number,
  ) {
    this.logger.debug(`Uploading avatar for channel ${channelId}`);
    return this.uploadService.uploadChannelAvatar(channelId, image);
  }
}
