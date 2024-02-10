import axios from 'axios';

const modifyUser = (id: number, data: any) => {
  axios.patch(process.env.BACKEND + `/api/users/${id}`, data, {
    withCredentials: true,
  });
};

export default modifyUser;
