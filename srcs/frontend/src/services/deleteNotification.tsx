import axios from 'axios';

async function deleteNotification(notificationId: number) {
  const { data } = await axios.delete(
    process.env.BACKEND + `/api/users/notifications/${notificationId}`,
    { withCredentials: true },
  );

  return data;
}

export default deleteNotification;
