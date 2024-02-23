import axiosInstance from './axios';

const kickUser = async (userId: number | undefined, channelId: number) => {
  const requestBody = {
    userId: userId,
  };

  const response =  axiosInstance.delete(`/api/users/chat/${channelId}/remove`, {
    data: requestBody,
  });
  return response;
};

export default kickUser;
