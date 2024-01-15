import axios from "axios";
import { toast } from 'react-hot-toast';

const confirmCode = async (code: string, phoneNumber: string | null) => {

    try {
        const response = await axios.post('http://localhost:3000/api/sms/confirm', {code, phoneNumber},  {withCredentials:true});
        if (response.data.status === 'error'){
            toast.error("Invalid!");
            return 0;
        }
        else {
            toast.success('Phone number verified successfully!');
            return 1;
        }
    }
    catch(error) {
        toast.error("An error has occured!");
    }
}

export default confirmCode;