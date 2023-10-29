import axios from "axios";

async function getUser(name:string) {

    const { data } = await axios.get(`http://localhost:3000/api/users?username=${name}`, {withCredentials: true} );
  
    console.log({ data });
    return data;
  }
  
  export default getUser;
  