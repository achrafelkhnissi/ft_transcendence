import axiosInstance from './axios';

const getAllUsersStatus = async () => {
  const response = axiosInstance.get('/api/users/all');
  return response;
};

export default getAllUsersStatus;
