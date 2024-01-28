import axios from 'axios';

const modifyUser = (username: string, data: any) => {
  axios.patch(process.env.BACKEND + `/api/users/${username}`, data, {
    withCredentials: true,
  });
};

export default modifyUser;
