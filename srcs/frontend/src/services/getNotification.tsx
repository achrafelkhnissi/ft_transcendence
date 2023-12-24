import axios from "axios";

async function getNotifications() {

    const { data } = await axios.get(`http://localhost:3000/api/users/notifications`, {withCredentials: true} );
  
    return data;
  }
  
  export default getNotifications;
  