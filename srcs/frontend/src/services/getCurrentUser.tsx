import axiosInstance from './axios';

async function getCurrentUser() {
  const { data } = await axiosInstance.get(`/api/users/me`);
  return data;
}

export default getCurrentUser;
