import axiosInstance from './axios';

async function getAllNumberss() {
  const response = axiosInstance.get(`/api/users/phoneNumbers`);
  return response;
}

export default getAllNumberss;
