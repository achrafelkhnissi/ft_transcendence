import axios from 'axios';

async function getUser(name: string) {
  const { data } = await axios.get(
    process.env.BACKEND + `/api/users?username=${name}`,
    { withCredentials: true },
  );

  return data;
}

export default getUser;
