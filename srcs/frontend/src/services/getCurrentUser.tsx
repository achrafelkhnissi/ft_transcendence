import axiosInstance from './axios';

async function getCurrentUser() {
  const response = axiosInstance.get(`/api/users/me`);
  return response;
}

export default getCurrentUser;
