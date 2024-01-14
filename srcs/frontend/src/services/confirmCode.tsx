import axios from "axios";

const confirmCode = async (code: string) =>{
    axios.post('http://localhost:3000/api/sms/confirm', code,  {withCredentials:true})
    // .then((response) => {
    //     console.log('verified successfully', response.data);
    // })
    // .catch((error) => {
    //     console.error('verification failed', error);
    // });
}

export default confirmCode;