import axiosInstance from './axios';

async function getAllRooms() {
  const response = axiosInstance.get(`/api/users/chat`);
  return response;
}

export default getAllRooms;
