import axios from 'axios';

const removeFriend = async (id: number | null) => {
  try{
    await axios.get(process.env.BACKEND + `/api/users/friends/remove?id=${id}`, {
      withCredentials: true,
    });
    return true;
  }
  catch (e) {
    console.log('error removing friend ',e);
    return false;
  }
};

export default removeFriend;
