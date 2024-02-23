import axiosInstance from './axios';

const unbanUser = async (userId: number | undefined, channelId: number) => {
  const response = axiosInstance.post(`/api/users/chat/${channelId}/unban`, {
    userId: userId,
  });
  return response;
};

export default unbanUser;
