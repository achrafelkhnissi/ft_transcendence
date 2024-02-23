import axiosInstance from './axios';

const blockUser = async (userId: number | undefined) => {
  const response = axiosInstance.get(
    `/api/users/friends/block?id=${userId}`,
  );
  return response;
};

export default blockUser;
