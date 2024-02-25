import axiosInstance from './axios';

const removeFriend = async (id: number | null) => {
  const {data} = await axiosInstance.get(`/api/users/friends/remove?id=${id}`);
  return data;
};

export default removeFriend;
