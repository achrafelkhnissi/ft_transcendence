import axiosInstance from './axios';

async function getUsersAll() {
  const response = axiosInstance.get(process.env.BACKEND + `/api/users/all`);
  return response;
}

export default getUsersAll;
