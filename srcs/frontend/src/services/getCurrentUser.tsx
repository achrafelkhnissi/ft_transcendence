import axios from 'axios';

async function getCurrentUser() {
  try {
    // axios
    //   .get(process.env.BACKEND + `/api/users/me`, { withCredentials: true })
    //   .then((res) => {
    //     console.log('res', res);
    //     return res.data;
    //   })
    //   .catch((e) => {
    //     console.log('Error getting current user', e);
    //   });
    const { data } = await axios.get(process.env.BACKEND + `/api/users/me`, {
      withCredentials: true,
    });

    return data;
  } catch (e) {
    console.log('Error getting current user', e);
    return null;
  }
}

export default getCurrentUser;
