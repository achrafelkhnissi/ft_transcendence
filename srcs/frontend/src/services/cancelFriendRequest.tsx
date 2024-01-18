import axios from "axios";

const cancelFriendRequest = async (name: string) => {
  const { data } = await axios.get(
    `http://localhost:3000/api/users/friends/requests/cancel?username=${name}`,
    { withCredentials: true }
    );
  return data;
};

export default cancelFriendRequest;
