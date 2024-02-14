import axios from 'axios';

const removeAdmin = async (userId: number | undefined, channelId: number) => {
  const requestBody = {
    userId: userId,
  };

  try {
    const { data } = await axios.delete(
      `${process.env.BACKEND}/api/users/chat/${channelId}/admins/remove`,
      { data: requestBody, withCredentials: true },
    );
    return data;
  } catch (error) {
    console.log('Error adding member:', error);
    return null;
  }
};

export default removeAdmin;
