import axiosInstance from './axios';

async function getRankings() {
  const response = axiosInstance.get(`/api/users/ranking`);
  return response;
}

export default getRankings;
