import axiosInstance from './axios';

const updateChannelType = async (channelId: number, data: any) => {
  const response = await axiosInstance.patch(
    `/api/users/chat/${channelId}`,
    data,
  );
  return response.data;
};

export default updateChannelType;
