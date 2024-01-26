import axios from 'axios';

async function getAllNumberss() {
  const { data } = await axios.get(
    `http://localhost:3000/api/users/phoneNumbers`,
    { withCredentials: true },
  );

  return data;
}

export default getAllNumberss;
