import axios from 'axios';

async function getCurrentUser() {
  try {
    const { data } = await axios.get(process.env.BACKEND + `/api/users/me`, {
      withCredentials: true,
    });
  
    return data;

  } catch (e){
    console.log('error getting user ', e);
    return null;
  }
}

export default getCurrentUser;
