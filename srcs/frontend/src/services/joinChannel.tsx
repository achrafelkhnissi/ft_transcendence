import axios from 'axios';

const joinChannel = async (
  channelId: number,
  payload: { password: string } | null,
) => {
  try {
    const { data } = await axios.post(
      process.env.BACKEND + `/api/users/chat/${channelId}/join`,
      payload,
      {
        withCredentials: true,
      },
    );
    return data;
  } catch (e) {
    console.log('error joining channel', e);
    return null;
  }
};

export default joinChannel;
