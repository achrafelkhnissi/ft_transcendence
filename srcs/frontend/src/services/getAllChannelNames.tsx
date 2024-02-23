import axiosInstance from './axios';

async function getAllChannelNames() {
  const response = axiosInstance.get(`/api/users/chat/names`);
  return response;
}

export default getAllChannelNames;
