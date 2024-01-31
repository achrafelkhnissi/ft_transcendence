import axios from 'axios';

async function getConversations(id? : number) {
  const { data } = await axios.get(process.env.BACKEND + `/api/users/chat${id? `?=${id}`: '' }`, {
    withCredentials: true,
  });

  return data;
}

export default getConversations;
