import axiosInstance from './axios';

const leaveChannel = async (channelId: number, userId: number | undefined) => {
  const response = axiosInstance.post(`/api/users/chat/${channelId}/leave`, {
    userId: userId,
  });
  return response;
};
export default leaveChannel;
