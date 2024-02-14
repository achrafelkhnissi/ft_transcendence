import axios from 'axios';

async function getConversations(id?: number) {
  try {
    if (!id) {
      const { data } = await axios.get(
        process.env.BACKEND + `/api/users/chat/me`,
        {
          withCredentials: true,
        },
      );
      return data;
    } else {
      const { data } = await axios.get(
        process.env.BACKEND + `/api/users/chat/${id}`,
        {
          withCredentials: true,
        },
      );
      console.log({ data });
      return data;
    }
  } catch (error) {
    console.log('error getting conversations of the user', error);
    return null;
  }
}

export default getConversations;
