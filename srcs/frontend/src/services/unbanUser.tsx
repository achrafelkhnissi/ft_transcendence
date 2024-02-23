import axiosInstance from './axios';

const unbanUser = async (userId: number | undefined, channelId: number) => {
  const {data} = await axiosInstance.post(`/api/users/chat/${channelId}/unban`, {
    userId: userId,
  });
  return data;
};

export default unbanUser;
