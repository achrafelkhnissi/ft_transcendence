import axios from 'axios';

async function getNotifications() {

  try {
    const { data } = await axios.get(
      process.env.BACKEND + `/api/users/notifications`,
      { withCredentials: true },
    );
  
    return data;
  }
  catch (e: any){
    if (e.response?.request?.status === 401) {
      console.log('Error getting notifications', e);
      return null;
    }
    return null;
  }
}

export default getNotifications;
