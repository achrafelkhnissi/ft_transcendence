import axiosInstance from './axios';

const banUser = async (userId: number | undefined, channelId: number) => {
  const response = axiosInstance.post(
    `/api/users/chat/${channelId}/ban`,
    { userId: userId },
  );
  return response;
};

export default banUser;
