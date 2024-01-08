import axios from "axios";

const verifyNumber = async ()=>{
    axios('http://localhost:3000/api/sms/verify', {withCredentials:true})
    .then((response) => {
        console.log('verified successfully', response.data);
    })
    .catch((error) => {
        console.error('verification failed', error);
    });
}

export default verifyNumber;