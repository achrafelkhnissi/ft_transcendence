import axiosInstance from './axios';

const addMember = async (userId: number, channelId: number) => {
  const response = axiosInstance.post(
    `${process.env.BACKEND}/api/users/chat/${channelId}/participants/add`,
    { userId: userId },
  );
  return response;
};

export default addMember;
