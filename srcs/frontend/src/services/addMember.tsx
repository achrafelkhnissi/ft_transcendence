import axiosInstance from './axios';

const addMember = async (userId: number, channelId: number) => {
  const {data} = await axiosInstance.post(
    `${process.env.BACKEND}/api/users/chat/${channelId}/participants/add`,
    { userId: userId },
  );
  return data;
};

export default addMember;
