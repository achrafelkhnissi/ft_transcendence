import axiosInstance from './axios';

async function declineFirendRequest(id: number) {
  const response = axiosInstance.get(
    process.env.BACKEND + `/api/users/friends/requests/decline?id=${id}`,
  );
  return response;
}

export default declineFirendRequest;
