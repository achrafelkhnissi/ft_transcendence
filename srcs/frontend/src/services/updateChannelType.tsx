import axios from 'axios';

const updateChannelType = async (channelId: number, data: any) => {
  console.log('updateChannelType: ', channelId, data);
  try {
    const response = await axios.patch(
      process.env.BACKEND + `/api/users/chat/${channelId}`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.log('Error updating channel type: ', error);
    return null;
  }
};

export default updateChannelType;
