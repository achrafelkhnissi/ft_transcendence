import axiosInstance from './axios';

async function getUsersAll() {
  const {data} = await axiosInstance.get(process.env.BACKEND + `/api/users/all`);
  return data;
}

export default getUsersAll;
