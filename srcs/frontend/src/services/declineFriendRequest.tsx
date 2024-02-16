import axios from 'axios';

async function declineFirendRequest(id: number | null) {
  try {
    const { data } = await axios.get(
      process.env.BACKEND + `/api/users/friends/requests/decline?id=${id}`,
      { withCredentials: true },
    );
    return data;
  } catch (e) {
    console.log('error declining friend request ', e);
    return null;
  }
}

export default declineFirendRequest;
