import axios from "axios";

async function getCurrentUser() {
  const data = await axios.get("http://localhost:3000/api/", {
    withCredentials: true,
  });

  console.log({ data });
  return data;
}

export default getCurrentUser;
