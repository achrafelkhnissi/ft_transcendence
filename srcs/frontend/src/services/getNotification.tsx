import axiosInstance from './axios';

async function getNotifications() {
  const {data} = await axiosInstance.get(`/api/users/notifications`);
  return data;
}

export default getNotifications;
