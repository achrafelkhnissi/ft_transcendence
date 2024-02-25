import axiosInstance from './axios';

async function getAllChannelNames() {
  const {data} = await  axiosInstance.get(`/api/users/chat/names`);
  return data;
}

export default getAllChannelNames;
