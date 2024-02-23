import axiosInstance from './axios';

const removeAdmin = async (userId: number | undefined, channelId: number) => {
  const requestBody = {
    userId: userId,
  };

  const response = axiosInstance.delete(`/api/users/chat/${channelId}/admins/remove`, {
    data: requestBody,
  });
  return response;
};

export default removeAdmin;
