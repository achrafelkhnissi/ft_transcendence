import axiosInstance from './axios';

const unblockUser = async (userId: number | undefined) => {
  const {data} = await axiosInstance(`/api/users/friends/unblock?id=${userId}`);
  return data;
};

export default unblockUser;
