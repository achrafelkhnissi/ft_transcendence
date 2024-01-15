import axios from "axios";
import { toast } from 'react-hot-toast';

const verifyNumber = async (num? : string)=>{

    try {
        const response = await axios.post('http://localhost:3000/api/sms/verify',{phoneNumber : num} ,{withCredentials:true})

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