import axios from "axios";

const getAvatar = async (name:string) => {
    const {data} = await axios(`http://localhost:3000/api/users/${name}/avatar`);
    console.log(data);
    return data;
}

export default getAvatar;