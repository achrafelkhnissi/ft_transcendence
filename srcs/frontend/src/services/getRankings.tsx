import axios from 'axios';

async function getRankings() {
  try {
    const { data } = await axios.get(process.env.BACKEND + `/api/users/ranking`, {
      withCredentials: true,
    });
  
    return data;

  } catch (e: any){
    if (e.response?.request?.status === 401) {
      console.log('Error getting rankings', e);
    }
    return null;
  }
}

export default getRankings;
