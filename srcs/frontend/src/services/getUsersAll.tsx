import axios from 'axios';

async function getUsersAll() {
  try {
    const { data } = await axios.get(process.env.BACKEND + `/api/users/all`, {
      withCredentials: true,
    });

    return data;
  } catch (error: any) {
    if (error.response?.request?.status === 401) {
      console.log('Error getting all users', error);
      return null;
    }
    return null;
  }
}

export default getUsersAll;
