import axiosInstance from './axios';

const kickUser = async (
  userId: number | undefined,
  channelId: number,
  role: string,
) => {
  const requestBody = {
    userId: userId,
  };

  const participant = role === 'admin' ? '' : 'participants/';

  const { data } = await axiosInstance.delete(
    `/api/users/chat/${channelId}/${participant}remove`,
    {
      data: requestBody,
    },
  );
  return data;
};

export default kickUser;
