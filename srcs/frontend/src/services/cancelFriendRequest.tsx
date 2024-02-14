import axios from 'axios';

const cancelFriendRequest = async (id: number | null) => {
  const { data } = await axios.get(
    process.env.BACKEND + `/api/users/friends/requests/cancel?id=${id}`,
    { withCredentials: true },
  );
  return data;
};

export default cancelFriendRequest;
