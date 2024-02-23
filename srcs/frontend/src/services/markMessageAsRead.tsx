import axiosInstance from './axios';

const markMessageAsRead = async (messageId: number) => {
  const response = axiosInstance.post(`/api/message/${messageId}/read`, {});
  return response;
};

export default markMessageAsRead;
