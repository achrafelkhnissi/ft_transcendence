import axios from 'axios';

const getAvatar = async (name: string) => {
  const { data } = await axios(
    process.env.BACKEND + `/api/users/${name}/avatar`,
  );
  console.log(data);
  return data;
};

export default getAvatar;
