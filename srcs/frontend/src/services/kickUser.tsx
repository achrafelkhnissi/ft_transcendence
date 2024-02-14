import axios from 'axios';

const kickUser = async (
  userId: number | undefined,
  channelId: number,
) => {
  const requestBody = {
    userId: userId,
  };

  try {
    const { data } = await axios.delete(
      process.env.BACKEND +
        `/api/users/chat/${channelId}/remove`,
      { data: requestBody, withCredentials: true },
    );
    return data;
  } catch (error) {
    console.log('Error kicking user: ', error);
    return null;
  }
};

export default kickUser;
