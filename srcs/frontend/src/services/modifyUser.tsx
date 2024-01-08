import axios from "axios";

const modifyUser = (username: string, data:any) => {
    axios.patch(`http://localhost:3000/api/users/${username}`, data, {withCredentials:true})
    .then((res) => console.log('modified '))
    .catch((res)=> console.log("error"));
}

export default modifyUser;