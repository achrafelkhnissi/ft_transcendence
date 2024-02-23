import axiosInstance from 'axios';

const removeFriend = async (id: number | null) => {
  const response = axiosInstance.get(`/api/users/friends/remove?id=${id}`);
  return response;
};

export default removeFriend;
