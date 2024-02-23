import axiosInstance from './axios';
import FormData from 'form-data';

const uploadAvatar = async (newAvatar: File | null) => {
  const filePath = newAvatar?.webkitRelativePath || '';

  const formData = new FormData();

  formData.append('image', newAvatar);

  const response = axiosInstance.post('/api/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export default uploadAvatar;
