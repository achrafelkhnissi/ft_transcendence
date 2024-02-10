import axios from 'axios';

async function declineFirendRequest(id: number | null) {
  const { data } = await axios.get(
    process.env.BACKEND +
      `/api/users/friends/requests/decline?id=${id}`,
    { withCredentials: true },
  );

  return data;
}

export default declineFirendRequest;
