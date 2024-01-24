import FileMapper from 'src/common/interfaces/file-mapper.interface';

export const fileMapper = ({ file, req }: FileMapper) => {
  const image_url = `${req.protocol}://${req.headers.host}/${file.path}`;

  return {
    originalname: file.originalname,
    filename: file.filename,
    image_url,
  };
};
