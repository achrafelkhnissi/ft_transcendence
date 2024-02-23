import axiosInstance from './axios';

const modifyUser = (id: number, data: any) => {
  const response = axiosInstance.patch(`/api/users/${id}`, data);
  return response;
};

export default modifyUser;
