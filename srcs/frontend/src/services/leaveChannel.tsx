import axios from 'axios';

const leaveChannel = async (channelId: number, userId: number | undefined) => {
  try {
    const response = await axios.post(
      process.env.BACKEND + `/api/users/chat/${channelId}/leave`,
      { userId: userId },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log('Error leaving channel: ', error);
    return null;
  }
};
export default leaveChannel;
