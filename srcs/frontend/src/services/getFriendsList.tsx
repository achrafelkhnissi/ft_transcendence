import axios from "axios";

async function getFriendsList(username: string) {

    console.log("name: " + username)
  const { data } = await axios.get(`http://localhost:3000/api/users/friends?username=${username}`,
   {withCredentials: true} );

  return data;
}

export default getFriendsList;