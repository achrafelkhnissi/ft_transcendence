import axios from "axios";

async function getCurrentUser() {

  const { data } = await axios.get("http://localhost:3000/api/auth/whoami", {withCredentials: true} );

  return data;
}

export default getCurrentUser;
