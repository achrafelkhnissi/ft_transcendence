import { Request } from 'express';

export default interface FileMapper {
  file: Express.Multer.File;
  req: Request;
}
