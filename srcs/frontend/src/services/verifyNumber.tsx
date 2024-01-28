import axios from 'axios';
import { toast } from 'react-toastify';

const verifyNumber = async (num?: string) => {
  try {
    const response = await axios.post(
      process.env.BACKEND + '/api/sms/verify',
      { phoneNumber: num },
      { withCredentials: true },
    );

    if (response.data.status === 'error') {
      toast.error('Verification failed. Please try again.');
      return 0;
    } else {
      toast('A message is sent to your phoneNumber');
      return 1;
    }
  } catch (error) {
    toast.error('Error verifying number. Please try again.');
  }
};

export default verifyNumber;
