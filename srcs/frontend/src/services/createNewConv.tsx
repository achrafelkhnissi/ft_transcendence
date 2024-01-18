import axios from "axios";

interface Props  {
    type: string;
    to: number | null;
}

const API_URL = 'http://localhost:3000/api/users/chat';

const createNewConv = async (convo: Props) => {
    try {
    const { data } = await axios.post(API_URL, convo, { withCredentials: true });
    console.log('in function');
    console.log({
        data,
    });
    return data;
  } catch (error) {
    console.error('Error creating new conversation:', error);
    return null;
  }
}

export default createNewConv