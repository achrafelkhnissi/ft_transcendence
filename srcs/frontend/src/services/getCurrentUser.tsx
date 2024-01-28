import axios from 'axios';

async function getCurrentUser() {
  const { data } = await axios.get(process.env.BACKEND + `/api/users/me`, {
    withCredentials: true,
  });

  return data;
}

export default getCurrentUser;
