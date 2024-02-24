import axiosInstance from './axios';

async function acceptFirendRequest(id: number) {
  const {data} = await axiosInstance.get(`/api/users/friends/requests/accept?id=${id}`);
  return data;
}

export default acceptFirendRequest;
