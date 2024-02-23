import axiosInstance from './axios';

const setNotifAsRead = async (notifId: number) => {
 const response = axiosInstance(`/api/users/notifications/${notifId}/read`);
  return response;
};
export default setNotifAsRead;
