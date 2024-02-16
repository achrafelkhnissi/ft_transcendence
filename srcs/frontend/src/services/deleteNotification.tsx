import axios from 'axios';

async function deleteNotification(notificationId: number) {
  try {
    const { data } = await axios.delete(
      process.env.BACKEND + `/api/users/notifications/${notificationId}`,
      { withCredentials: true },
    );

    return data;
  } catch (e) {
    console.log('error deleting notification ', e);
    return null;
  }
}

export default deleteNotification;
