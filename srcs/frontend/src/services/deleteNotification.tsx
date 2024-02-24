import axiosInstance from './axios';

async function deleteNotification(notificationId: number) {
  const {data} =  await axiosInstance.delete(
     `/api/users/notifications/${notificationId}`,
  );
  return data;
}

export default deleteNotification;
