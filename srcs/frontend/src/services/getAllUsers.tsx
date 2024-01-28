import axios from 'axios';

async function getAllUsers() {
  const { data } = await axios.get(
    process.env.BACKEND + `/api/users/usernames`,
    { withCredentials: true },
  );

  return data;
}

export default getAllUsers;
