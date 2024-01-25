import axios from 'axios';

async function declineFirendRequest(friend: string) {
  const { data } = await axios.get(
    `http://localhost:3000/api/users/friends/requests/decline?username=${friend}`,
    { withCredentials: true },
  );

  return data;
}

export default declineFirendRequest;
