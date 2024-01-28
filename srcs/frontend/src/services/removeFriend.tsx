import axios from 'axios';

const removeFriend = async (exFriend: string) => {
  const { data } = await axios.get(
    process.env.BACKEND + `/api/users/friends/remove?username=${exFriend}`,
    { withCredentials: true },
  );
};

export default removeFriend;
