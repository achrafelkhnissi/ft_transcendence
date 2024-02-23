import axiosInstance from './axios';

async function acceptFirendRequest(id: number) {
  const response = await axiosInstance.get(`/api/users/friends/requests/accept?id=${id}`);
  return response;
}

export default acceptFirendRequest;
