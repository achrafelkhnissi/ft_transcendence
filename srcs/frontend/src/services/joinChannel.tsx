import axiosInstance from './axios';

const joinChannel = async (
  channelId: number,
  payload: { password: string } | null,
) => {
  const response = axiosInstance.post(`/api/users/chat/${channelId}/join`, payload);
  return response;
};

export default joinChannel;
