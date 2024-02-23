import axiosInstance from './axios';

async function getNotifications() {
  const response = axiosInstance.get(`/api/users/notifications`);
  return response;
}

export default getNotifications;
