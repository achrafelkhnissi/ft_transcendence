import axios from 'axios';

async function getUser(name: string) {

  try {
      const { data } = await axios.get(
        process.env.BACKEND + `/api/users?username=${name}`,
        { withCredentials: true },
      );

    return data;
  }
  catch{
    return null;
  }

}

export default getUser;
