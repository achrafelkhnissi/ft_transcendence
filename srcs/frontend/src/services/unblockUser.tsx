import axios from "axios";

const unblockUser = async (userId: number | undefined) => {
    try {
        const { data } = await axios(
          `${process.env.BACKEND}/api/users/friends/unblock?id=${userId}`,
          { withCredentials: true },
        );
        return data;
      } catch (error) {
        console.log('Error blocking member:', error);
        return null;
      }
}

export default unblockUser;