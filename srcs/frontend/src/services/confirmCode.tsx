import axios from "axios";
import { toast } from 'react-toastify';

const confirmCode = async (code: string, phoneNumber: string | null) => {

    try {
        const response = await axios.post('http://localhost:3000/api/sms/confirm', {code, phoneNumber},  {withCredentials:true});
        if (response.data.status === 'error'){
            toast.error("Wrong verification code. Please check and try again.");
            return 0;
        }
        else {
            toast.success('Phone number verified successfully!');
            return 1;
        }
    }
    catch(error) {
        toast.error("Error verifying code. Please try again.");
    }
}

export default confirmCode;