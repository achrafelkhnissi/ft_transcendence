import axios from "axios";

const getCurrentUser = async () => {
  const response = await axios.get("https://localhost:3000/api/auth/whoami", {
    withCredentials: true,
  });
  return response.data;
};

export default getCurrentUser;
