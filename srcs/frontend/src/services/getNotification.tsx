import axios from 'axios';

async function getNotifications() {
  const { data } = await axios.get(
    process.env.BACKEND + `/api/users/notifications`,
    { withCredentials: true },
  );

  return data;
}

export default getNotifications;
