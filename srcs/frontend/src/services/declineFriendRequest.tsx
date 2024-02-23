import axiosInstance from './axios';

async function declineFirendRequest(id: number) {
  const {data} = await axiosInstance.get(
  `/api/users/friends/requests/decline?id=${id}`,
  );
  return data;
}

export default declineFirendRequest;
