
import axiosInstance from './axios';
import FormData from 'form-data';

const uploadChannelImage = async (newImage: File | null) => {
    const filePath = newImage?.webkitRelativePath || '';

    const formData = new FormData();

    formData.append('image', newImage);

    const response = axiosInstance.post('/api/upload/channel-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
};

export default uploadChannelImage;
