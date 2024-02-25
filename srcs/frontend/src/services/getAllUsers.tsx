import axiosInstance from './axios';

async function getAllUsers() {
  const {data} = await axiosInstance.get(`/api/users/usernames`);
  return data;
}

export default getAllUsers;
