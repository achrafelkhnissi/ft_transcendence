import axiosInstance from './axios';

const muteUser = async (
  userId: number | undefined,
  channelId: number,
  muteDuration: string,
) => {
  const {data} = await axiosInstance.post(`/api/users/chat/${channelId}/mute`, {
    userId: userId,
    duration: muteDuration,
  });
  return data;
};

export default muteUser;
