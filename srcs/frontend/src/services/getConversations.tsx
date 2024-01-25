import axios from 'axios';

async function getConversations() {
  const { data } = await axios.get(`http://localhost:3000/api/users/chat`, {
    withCredentials: true,
  });

  return data;
}

export default getConversations;
