import axiosInstance from './axios';

const removeAdmin = async (userId: number | undefined, channelId: number) => {
  const requestBody = {
    userId: userId,
  };

  const {data} = await axiosInstance.delete(`/api/users/chat/${channelId}/admins/remove`, {
    data: requestBody,
  });
  return data;
};

export default removeAdmin;
