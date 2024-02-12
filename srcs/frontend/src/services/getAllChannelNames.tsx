import axios from 'axios';

async function getAllChannelNames() {
  try {
    const { data } = await axios.get(
      process.env.BACKEND + `/api/users/chat/names`,
      { withCredentials: true },
    );
    return data;
  } catch {
    return null;
  }
}

export default getAllChannelNames;
