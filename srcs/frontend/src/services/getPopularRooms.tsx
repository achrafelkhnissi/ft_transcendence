import axiosInstance from './axios';

const getPoularRooms = async () => {
  const response = axiosInstance.get('/api/users/chat/popular');
  return response;
};

export default getPoularRooms;
