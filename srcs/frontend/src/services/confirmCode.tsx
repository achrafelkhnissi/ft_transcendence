import axios from "axios";
import { toast } from 'react-hot-toast';

const confirmCode = async (code: string) =>{
    console.log("here " + code);

    try {
        const response = await axios.post('http://localhost:3000/api/sms/confirm', {code},  {withCredentials:true});
        if (response.data.status === 'error'){
            toast.error("An error has occured!");
        }
    }
    catch(error) {
        toast.error("An error has occured!");
    }
}

export default confirmCode;