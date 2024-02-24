import axiosInstance from './axios';

const modifyUser = (id: number, data: any) => {
  axiosInstance.patch(`/api/users/${id}`, data);
};

export default modifyUser;
