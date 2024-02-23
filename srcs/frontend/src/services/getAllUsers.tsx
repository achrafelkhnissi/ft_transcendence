import axiosInstance from './axios';

async function getAllUsers() {
  const response = axiosInstance.get(`/api/users/usernames`);
  return response;
}

export default getAllUsers;
