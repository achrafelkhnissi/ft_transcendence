import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editUserAvatarFileName,
  editChannelAvatarFileName,
} from 'src/common/utils/edit-file-name';
import { imageFileFilter } from 'src/common/utils/image-file-filter';

export function UserAvatarUploadInterceptor() {
  return UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/user-avatars',
        filename: editUserAvatarFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  );
}

export function ChannelAvatarUploadInterceptor() {
  return UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/channel-avatars',
        filename: editChannelAvatarFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  );
}
