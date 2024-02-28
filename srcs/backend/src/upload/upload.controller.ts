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
import {
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

const imageUploadSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      format: 'binary',
    },
  },
};

@ApiTags('upload')
@ApiForbiddenResponse({ description: 'Forbidden' })
@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  private readonly logger = new Logger(UploadController.name);

  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: imageUploadSchema })
  @ApiCreatedResponse({ description: 'User avatar uploaded' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOperation({ summary: 'Upload user avatar' })
  @UserAvatarUploadInterceptor()
  uploadAvatar(
    @UploadedFileValidator() image: Express.Multer.File,
    @User() user: UserType,
  ) {
    return this.uploadService.uploadUserAvatar(user.id, image);
  }

  @Post('channel-avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: imageUploadSchema })
  @ApiCreatedResponse({ description: 'Channel avatar uploaded' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiOperation({ summary: 'Upload channel avatar' })
  @ChannelAvatarUploadInterceptor()
  uploadChannelAvatar(@UploadedFileValidator() image: Express.Multer.File) {
    return this.uploadService.uploadChannelAvatar(image);
  }
}
