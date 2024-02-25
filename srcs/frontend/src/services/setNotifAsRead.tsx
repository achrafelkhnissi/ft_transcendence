import axiosInstance from './axios';

const setNotifAsRead = async (notifId: number) => {
 const {data} = await axiosInstance(`/api/users/notifications/${notifId}/read`);
  return data;
};
export default setNotifAsRead;
