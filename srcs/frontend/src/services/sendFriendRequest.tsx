import axiosInstance from 'axios';
const sendFriendRequest = async (id: number | null) => {
  const response = axiosInstance.get(`/api/users/friends/requests/send?id=${id}`);
  return response;
};

export default sendFriendRequest;
