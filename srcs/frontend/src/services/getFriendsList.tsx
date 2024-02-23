import axiosInstance from './axios';

async function getFriendsList(id: number) {
  const {data} = await axiosInstance.get(`/api/users/friends?id=${id}`);
  return data;
}

export default getFriendsList;
