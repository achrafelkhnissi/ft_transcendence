import axiosInstance from './axios';

const unblockUser = async (userId: number | undefined) => {
  const response = axiosInstance(`/api/users/friends/unblock?id=${userId}`);
  return response;
};

export default unblockUser;
