import axiosInstance from './axios';

const muteUser = async (
  userId: number | undefined,
  channelId: number,
  muteDuration: string,
) => {
  const response = axiosInstance.post(`/api/users/chat/${channelId}/mute`, {
    userId: userId,
    duration: muteDuration,
  });
  return response;
};

export default muteUser;
