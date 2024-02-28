import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.BACKEND,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    return { data: null };
  },
);

export default instance;
