import axios from "axios";

const markMessageAsRead = async (messageId: number) => {
    console.log('marking message as read', messageId)
    try{
        const {data} = await axios.post(process.env.BACKEND + `/api/message/${messageId}/read`, 
        {}, {withCredentials: true});
        return data;
    }
    catch(e){
        console.log('error marking message as read', e);
        return null;
    }
}

export default markMessageAsRead