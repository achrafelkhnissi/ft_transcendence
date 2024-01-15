import axios from "axios";
import { toast } from 'react-hot-toast';

const verifyNumber = async ()=>{

    try {
        const response = await axios('http://localhost:3000/api/sms/verify', {withCredentials:true})

        if (response.data.status === 'error'){
            toast.error("An error has occured!");
            return 0;
        }
        else {
            toast("A message is sent to your phoneNumber");
            return 1;
        }
    }
    catch(error) {
        toast.error("An error has occured!");
    }
}

export default verifyNumber;