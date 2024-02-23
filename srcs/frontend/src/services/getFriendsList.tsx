import axiosInstance from './axios';

async function getFriendsList(id: number) {
  const response = axiosInstance.get(`/api/users/friends?id=${id}`);
  return response;
}

export default getFriendsList;
