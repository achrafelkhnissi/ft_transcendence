import axios from 'axios';

async function declineFirendRequest(friend: string) {
  const { data } = await axios.get(
    process.env.BACKEND +
      `/api/users/friends/requests/decline?username=${friend}`,
    { withCredentials: true },
  );

  return data;
}

export default declineFirendRequest;
