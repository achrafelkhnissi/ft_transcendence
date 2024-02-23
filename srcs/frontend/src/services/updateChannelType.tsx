import axiosInstance from './axios';

const updateChannelType = async (channelId: number, data: any) => {

  const response =  axiosInstance.patch(`/api/users/chat/${channelId}`, data);
  return response;
};

export default updateChannelType;
