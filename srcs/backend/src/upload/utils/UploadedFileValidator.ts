import {
  ParseFilePipe,
  UploadedFile,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

export function UploadedFileValidator() {
  return UploadedFile(
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
  );
}
