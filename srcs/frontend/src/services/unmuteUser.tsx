import axiosInstance from './axios';

const unmuteUser = async (userId: number | undefined, channelId: number) => {
  const response = axiosInstance.post(`/api/users/chat/${channelId}/unmute`, {
    userId: userId,
  });
  return response;
};

export default unmuteUser;
