import axios from 'axios';

async function getRankings() {
  const { data } = await axios.get(process.env.BACKEND + `/api/users/ranking`, {
    withCredentials: true,
  });

  return data;
}

export default getRankings;
