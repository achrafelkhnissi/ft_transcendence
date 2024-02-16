import axios from 'axios';

const cancelFriendRequest = async (id: number | null) => {
  try {
    const { data } = await axios.get(
      process.env.BACKEND + `/api/users/friends/requests/cancel?id=${id}`,
      { withCredentials: true },
    );
    return data;
  } catch (e) {
    console.log('error canceling friend request ', e);
    return null;
  }
};

export default cancelFriendRequest;
