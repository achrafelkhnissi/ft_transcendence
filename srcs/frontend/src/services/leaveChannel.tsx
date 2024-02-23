import axiosInstance from './axios';

const leaveChannel = async (channelId: number, userId: number | undefined) => {
  const {data} = await axiosInstance.post(`/api/users/chat/${channelId}/leave`, {
    userId: userId,
  });
  return data;
};
export default leaveChannel;
