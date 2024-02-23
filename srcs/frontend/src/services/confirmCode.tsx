import axiosInstance from './axios';
import { toast } from 'react-toastify';

//TODO: test this function
const confirmCode = async (code: string, phoneNumber: string | null) => {
  if (code == phoneNumber) {
    phoneNumber = null;
  }

  const response = await axiosInstance.post('/api/sms/confirm', {
    code,
    phoneNumber,
  });
  if (response.data.status === 'error') {
    toast.error('Wrong verification code. Please check and try again.');
    return 0;
  } else {
    toast.success('Phone number verified successfully!');
    return 1;
  }
};

export default confirmCode;
