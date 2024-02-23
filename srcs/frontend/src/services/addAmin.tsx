import axiosInstance from 'axios';

const addAdmin = async (userId: number | undefined, channelId: number) => {
  const response = await axiosInstance.post(`/api/users/chat/${channelId}/admins/add`, {
    userId: userId,
  });
  return response;
};

export default addAdmin;
