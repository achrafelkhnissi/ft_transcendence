import axios from 'axios';

interface Props {
  type: string;
  image?: string;
  name?: string;
  password: string;
  participants: number[];
}

const API_URL = process.env.BACKEND + '/api/users/chat';

const createNewConv = async (convo: Props) => {
  try {
    const { data } = await axios.post(API_URL, convo, {
      withCredentials: true,
    });
    console.log({
      data,
    });
    return data;
  } catch (error) {
    console.error('Error creating new conversation:', error);
    return null;
  }
};

export default createNewConv;
