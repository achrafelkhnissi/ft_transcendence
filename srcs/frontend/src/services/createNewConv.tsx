import axios from "axios";

interface Props  {
    type: string;
    to: number | null;
}

const createNewConv = async (convo: Props) => {
    console.log('in function');
    const {data} = await axios.post('http://localhost:3000/api/users/chat', convo, {withCredentials: true});
    console.log('after function')
    return data;
}

export default createNewConv