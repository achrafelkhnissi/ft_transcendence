import axiosInstance from './axios';

async function getAllRooms() {
  const {data} = await axiosInstance.get(`/api/users/chat`);
  return data;
}

export default getAllRooms;
