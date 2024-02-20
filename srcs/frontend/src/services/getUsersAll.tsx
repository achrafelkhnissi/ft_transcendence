import axios from 'axios';

async function getUsersAll() {
  try {
    const { data } = await axios.get(process.env.BACKEND + `/api/users/all`, {
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default getUsersAll;
