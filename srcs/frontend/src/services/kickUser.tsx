import axiosInstance from './axios';

const kickUser = async (userId: number | undefined, channelId: number) => {
  const requestBody = {
    userId: userId,
  };

  const {data} = await axiosInstance.delete(`/api/users/chat/${channelId}/participants/remove`, { 
    data: requestBody,
  });
  return data;
};

export default kickUser;
