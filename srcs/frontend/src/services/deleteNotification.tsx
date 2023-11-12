import axios from "axios";

async function deleteNotification(notificationId: number) {

  const { data } = await axios.delete(`http://localhost:3000/api/users/notifications/:${notificationId}`, {withCredentials: true} );

  return data;
}

export default deleteNotification;
