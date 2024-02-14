import axios from 'axios';

const addMember = async (userId: number, channelId: number) => {
  try {
    const { data } = await axios.post(
      `${process.env.BACKEND}/api/users/chat/${channelId}/participants/add`,
      { userId: userId },
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    console.log('Error adding member:', error);
    return null;
  }
};

export default addMember;
