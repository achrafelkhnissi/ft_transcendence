import axios from 'axios';

async function getConversations(id?: number) {
  if (!id) {
    const { data } = await axios.get(process.env.BACKEND + `/api/users/chat`, {
      withCredentials: true,
    });
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
}

export default getConversations;
