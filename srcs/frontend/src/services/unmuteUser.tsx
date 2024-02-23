import axiosInstance from './axios';

const unmuteUser = async (userId: number | undefined, channelId: number) => {
  const {data} = await axiosInstance.post(`/api/users/chat/${channelId}/unmute`, {
    userId: userId,
  });
  return data;
};

export default unmuteUser;
