import axiosInstance from './axios';

const banUser = async (userId: number | undefined, channelId: number) => {
  const {data} = await axiosInstance.post(
    `/api/users/chat/${channelId}/ban`,
    { userId: userId },
  );
  return data;
};

export default banUser;
