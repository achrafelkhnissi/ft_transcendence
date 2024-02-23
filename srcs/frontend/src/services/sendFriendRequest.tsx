import axiosInstance from 'axios';
const sendFriendRequest = async (id: number | null) => {
  const {data} = await axiosInstance.get(`/api/users/friends/requests/send?id=${id}`);
  return data;
};

export default sendFriendRequest;
