import axiosInstance from './axios';

async function getUser(name: string) {
  const response = axiosInstance.get(`/api/users?username=${name}`);
  return response;
}

export default getUser;
