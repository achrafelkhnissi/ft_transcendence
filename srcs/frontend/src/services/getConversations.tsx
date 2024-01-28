import axios from 'axios';

async function getConversations() {
  const { data } = await axios.get(process.env.BACKEND + `/api/users/chat`, {
    withCredentials: true,
  });

  return data;
}

export default getConversations;
