import axios from 'axios';
const sendFriendRequest = async (id: number | null) => {
  try {
    const { data } = await axios.get(
      process.env.BACKEND + `/api/users/friends/requests/send?id=${id}`,
      { withCredentials: true },
    );
    console.log('here');
    console.log(data);
    return data;
  } catch (e) {
    console.log('error sending friend request ', e);
    return null;
  }
};

export default sendFriendRequest;
