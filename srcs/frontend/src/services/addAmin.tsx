import axiosInstance from './axios';

const addAdmin = async (userId: number | undefined, channelId: number) => {
  const {data} = await axiosInstance.post(`/api/users/chat/${channelId}/admins/add`, {
    userId: userId,
  });
  return data;
};

export default addAdmin;
