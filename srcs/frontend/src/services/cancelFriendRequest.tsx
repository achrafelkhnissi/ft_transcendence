import axiosInstance from './axios';

const cancelFriendRequest = async (id: number | null) => {
  const {data} = await axiosInstance.get(
 `/api/users/friends/requests/cancel?id=${id}`,
  );
  return data;
};

export default cancelFriendRequest;
