import axios from "axios";

async function getRankings() {
    const { data } = await axios.get(`http://localhost:3000/api/users/ranking`,
    {withCredentials: true} );
 
   return data;
}

export default getRankings