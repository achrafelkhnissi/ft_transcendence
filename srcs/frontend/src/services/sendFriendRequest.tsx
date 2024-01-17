import axios from "axios";
const sendFriendRequest = async (friend:string) => {
    const { data } = await axios.get(`http://localhost:3000/api/users/friends/requests/send?username=${friend}`, {withCredentials: true} );
    console.log('here');
    console.log(data);
    return data;
}

export default sendFriendRequest