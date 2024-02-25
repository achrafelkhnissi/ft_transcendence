import axiosInstance from './axios';

const getAllUsersStatus = async () => {
  const {data} = await axiosInstance.get('/api/users/all');
  return data;
};

export default getAllUsersStatus;
