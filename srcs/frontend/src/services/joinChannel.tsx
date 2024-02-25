import axiosInstance from './axios';

const joinChannel = async (
  channelId: number,
  payload: { password: string } | null,
) => {
  const {data} = await axiosInstance.post(`/api/users/chat/${channelId}/join`, payload);
  return data;
};

export default joinChannel;
