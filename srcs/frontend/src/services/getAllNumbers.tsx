import axios from 'axios';

async function getAllNumberss() {
  const { data } = await axios.get(
    process.env.BACKEND + `/api/users/phoneNumbers`,
    { withCredentials: true },
  );

  return data;
}

export default getAllNumberss;
