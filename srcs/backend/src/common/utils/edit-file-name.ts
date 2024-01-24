import { Request } from 'express';
import * as path from 'path';
import { Logger } from '@nestjs/common';

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const { user } = req;

  // const originalName = file.originalname.split('.')[0];
  const fileExtName = path.extname(file.originalname);

  const filename = `${user.id}.${user.username}-avatar${fileExtName}`;

  Logger.debug(`Renaming ${file.originalname} to ${filename}`);

  callback(null, filename);
};
