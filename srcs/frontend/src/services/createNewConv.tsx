import axiosInstance from './axios';

interface Props {
  type: string;
  image?: string;
  name?: string;
  password?: string;
  participants: number[];
}

const createNewConv = async (convo: Props) => {
  const response = axiosInstance.post('/api/users/chat', convo);
  return response;
};

export default createNewConv;
