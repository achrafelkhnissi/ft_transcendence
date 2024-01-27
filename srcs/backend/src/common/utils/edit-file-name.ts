import { Request } from 'express';
import * as path from 'path';

export const editUserAvatarFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const { user } = req;
  const fileExtName = path.extname(file.originalname);
  const filename = `${user.id}.${user.username}-avatar${fileExtName}`;
  callback(null, filename);
};

export const editChannelAvatarFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) => {
  const fileExtName = path.extname(file.originalname);
  const filename = path.basename(file.originalname, fileExtName);
  callback(null, `${filename}-${Date.now()}${fileExtName}`);
};
