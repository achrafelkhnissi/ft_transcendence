import axios from 'axios';

async function getAllUsers() {
  const { data } = await axios.get(
    `http://localhost:3000/api/users/usernames`,
    { withCredentials: true },
  );

  return data;
}

export default getAllUsers;
