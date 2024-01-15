import axios from "axios";

const confirmCode = async (code: string) =>{
    console.log("here " + code);

    try {
        const response = await axios.post('http://localhost:3000/api/sms/confirm', {code},  {withCredentials:true});

        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            console.log('success');
          } else {
            // If the response status is not in the 2xx range, handle the error
            console.log(`Error: ${response.data.error}`);
          }
    }
    catch(error) {
        console.log('verification failed');
    }
}

export default confirmCode;