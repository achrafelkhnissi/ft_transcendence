import axios from 'axios';

const removeFriend = async (id: number) => {
  await axios.get(process.env.BACKEND + `/api/users/friends/remove?id=${id}`, {
    withCredentials: true,
  });
};

export default removeFriend;
