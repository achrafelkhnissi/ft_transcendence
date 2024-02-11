import axios from 'axios';

async function acceptFirendRequest(id: number) {
  const { data } = await axios.get(
    `${process.env.BACKEND}/api/users/friends/requests/accept?id=${id}`,
    { withCredentials: true },
  );

  return data;
}

export default acceptFirendRequest;
