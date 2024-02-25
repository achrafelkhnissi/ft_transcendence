import axiosInstance from './axios';

async function getRankings() {
  const {data} =  await axiosInstance.get(`/api/users/ranking`);
  return data;
}

export default getRankings;
