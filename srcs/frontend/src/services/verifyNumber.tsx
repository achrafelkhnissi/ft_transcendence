import axiosInstance from './axios';
import { toast } from 'react-toastify';

const verifyNumber = async (num?: string) => {
  try {
    const {data} = await axiosInstance.post(
      process.env.BACKEND + '/api/sms/verify',
      { phoneNumber: num },
    );
    if (data.status === 'error') {
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
