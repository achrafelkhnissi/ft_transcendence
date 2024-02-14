import axios from 'axios';

const getPoularRooms = async () => {
  try {
    const { data } = await axios.get(
      process.env.BACKEND + '/api/users/chat/popular',
      { withCredentials: true },
    );
    return data;
  } catch (error) {
    console.log('error getting popular rooms', error);
    return null;
  }
};

export default getPoularRooms;
