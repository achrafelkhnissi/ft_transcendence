import axios from "axios";

export interface IdResponse {
  id: string;
}

const getCurrentUserId = async (): Promise<IdResponse> => {
  const response = await axios.get<IdResponse>(
    "https://localhost:3000/api/auth/whoami",
    { withCredentials: true }
  );
  return response.data;
};

export default getCurrentUserId;
