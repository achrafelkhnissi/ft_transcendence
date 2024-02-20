import axios from 'axios';

async function getAllUsers() {
  try {
    const { data } = await axios.get(
      process.env.BACKEND + `/api/users/usernames`,
      { withCredentials: true },
    );

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default getAllUsers;
