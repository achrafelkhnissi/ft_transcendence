import axiosInstance from './axios';

const blockUser = async (userId: number | undefined) => {
  const {data} = await axiosInstance.get(
    `/api/users/friends/block?id=${userId}`,
  );
  return data;
};

export default blockUser;
