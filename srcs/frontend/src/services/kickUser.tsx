import axios from 'axios';

const kickUser = async (
  userId: number | undefined,
  channelId: number,
  role: string,
) => {
  const requestBody = {
    userId: userId,
  };

  try {
    if (role == 'admin') {
      const { data } = await axios.delete(
        process.env.BACKEND + `/api/users/chat/${channelId}/admins/remove`,
        { data: requestBody, withCredentials: true },
      );
      return data;
    } else {
      const { data } = await axios.delete(
        process.env.BACKEND +
          `/api/users/chat/${channelId}/participants/remove`,
        { data: requestBody, withCredentials: true },
      );
      return data;
    }
  } catch (error) {
    console.log('Error kicking user: ', error);
    return null;
  }
};

export default kickUser;
