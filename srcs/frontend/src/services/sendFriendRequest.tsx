import axios from 'axios';
const sendFriendRequest = async (id: number | null) => {
  const { data } = await axios.get(
    process.env.BACKEND + `/api/users/friends/requests/send?id=${id}`,
    { withCredentials: true },
  );
  console.log('here');
  console.log(data);
  return data;
};

export default sendFriendRequest;
