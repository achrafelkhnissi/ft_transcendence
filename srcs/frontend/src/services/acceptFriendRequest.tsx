import axios from 'axios';

async function acceptFirendRequest(friend: string) {
  const { data } = await axios.get(
    `${process.env.BACKEND}/api/users/friends/requests/accept?username=${friend}`,
    { withCredentials: true },
  );

  return data;
}

export default acceptFirendRequest;
