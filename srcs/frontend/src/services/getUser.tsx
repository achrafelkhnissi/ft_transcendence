import axios from 'axios';

async function getUser(name: string) {
  try {
    console.log('name: ', name);
    const { data } = await axios.get(
      process.env.BACKEND + `/api/users?username=${name}`,
      { withCredentials: true },
    );
    console.log('data: ', data);
    return data;
  } catch {
    return null;
  }
}

export default getUser;
