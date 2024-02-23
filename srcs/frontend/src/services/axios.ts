
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.BACKEND,
  withCredentials: true, 
});

instance.interceptors.response.use(
  (response) => {
    console.log('Response was received', response.data);
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      console.log('Unauthorized access, redirecting to login page...');
      window.location.href = '/';
    }
    return null;
  }
);

export default instance;
