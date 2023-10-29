import axios from "axios";
import Image from "next/image";

async function getCurrentUser() {

  const { data } = await axios.get("http://localhost:3000/api/auth/whoami", {withCredentials: true} );

  console.log({ data });
  return data;
}

export default getCurrentUser;
