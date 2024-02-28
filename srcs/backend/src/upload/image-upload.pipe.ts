import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import * as sharp from 'sharp';
import * as path from 'path';

@Injectable()
export class ImageUploadPipe implements PipeTransform {
  async transform(image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException('No image found');
    }

    const originalName = path.parse(image.originalname).name;
    const filename = Date.now() + '-' + originalName + '.jpg';

    const type = await fileTypeFromBuffer(image.buffer);

    const MIME_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

    if (!type || !MIME_TYPES.includes(type.mime)) {
      throw new BadRequestException('Only images are allowed');
    }

    await sharp(image.buffer)
      .resize(300, 300)
      .jpeg({ quality: 90 })
      .toFile(`uploads/${filename}`);

    return filename;
  }
}
