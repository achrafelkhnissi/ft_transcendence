import axios from 'axios';

async function acceptFirendRequest(id: number) {
  try {
    const { data } = await axios.get(
      `${process.env.BACKEND}/api/users/friends/requests/accept?id=${id}`,
      { withCredentials: true },
    );
    return data;
  } catch (e) {
    console.log('error accepting friend request ', e);
    return null;
  }
}

export default acceptFirendRequest;
