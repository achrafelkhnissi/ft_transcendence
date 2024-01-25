import axios from 'axios';

const removeFriend = async (exFriend: string) => {
  const { data } = await axios.get(
    `http://localhost:3000/api/users/friends/remove?username=${exFriend}`,
    { withCredentials: true },
  );
};

export default removeFriend;
