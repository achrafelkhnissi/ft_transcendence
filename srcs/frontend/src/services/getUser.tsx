import axiosInstance from './axios';

async function getUser(name: string) {
  const {data} = await axiosInstance.get(`/api/users?username=${name}`);
  return data;
}

export default getUser;
