import axiosInstance from './axios';

async function deleteNotification(notificationId: number) {
  const response = axiosInstance.delete(
    process.env.BACKEND + `/api/users/notifications/${notificationId}`,
  );
  return response;
}

export default deleteNotification;
