import axiosInstance from './axios';

const getPoularRooms = async () => {
  const {data} = await axiosInstance.get('/api/users/chat/popular');
  return data;
};

export default getPoularRooms;
