import {
  // ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import * as sharp from 'sharp';
import * as path from 'path';

@Injectable()
export class ImageUploadPipe implements PipeTransform {
  async transform(image: Express.Multer.File) {
    console.log('MyCustomFileValidator');

    if (!image) {
      throw new BadRequestException('No image found');
    }

    const originalName = path.parse(image.originalname).name;
    const filename = Date.now() + '-' + originalName + '.jpg'; // TODO: Check if .webp is better

    const type = await fileTypeFromBuffer(image.buffer);
    // const { mime } = (await fromBuffer(image.buffer)) ?? null;

    const MIME_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

    if (!type || !MIME_TYPES.includes(type.mime)) {
      throw new BadRequestException('Only images are allowed');
    }

    // TODO: Maybe add username or userId to filename
    await sharp(image.buffer)
      .resize(300, 300) // TODO: Consider return an exception if image is larger than 3MB
      .jpeg({ quality: 90 })
      .toFile(`uploads/${filename}`); // TODO: Check if this works
    // .toFile(path.join('uploads', filename));
    // .toFile(path.join(__dirname, '..', '..', 'uploads', filename));

    return filename;
  }
}
