import axiosInstance from './axios';

const markMessageAsRead = async (messageId: number) => {
  const {data} = await axiosInstance.post(`/api/message/${messageId}/read`, {});
  return data;
};

export default markMessageAsRead;
