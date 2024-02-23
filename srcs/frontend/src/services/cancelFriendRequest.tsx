import axiosInstance from './axios';

const cancelFriendRequest = async (id: number | null) => {
  const response = axiosInstance.get(
 `/api/users/friends/requests/cancel?id=${id}`,
  );
  return response;
};

export default cancelFriendRequest;
