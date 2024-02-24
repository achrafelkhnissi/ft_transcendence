import axiosInstance from './axios';

async function getAllNumberss() {
  const {data} = await axiosInstance.get(`/api/users/phoneNumbers`);
  return data;
}

export default getAllNumberss;
