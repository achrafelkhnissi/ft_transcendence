import axios from 'axios';

async function getFriendsList(id: number) {
  const { data } = await axios.get(
    process.env.BACKEND + `/api/users/friends?id=${id}`,
    { withCredentials: true },
  );

  return data;
}

export default getFriendsList;
