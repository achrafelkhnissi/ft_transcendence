import axios from "axios";

const blockUser = async (userId: number | undefined) => {
    try {
        const { data } = await axios(
          `${process.env.BACKEND}/api/users/friends/block?id=${userId}`,
          { withCredentials: true },
        );
        return data;
      } catch (error) {
        console.log('Error blocking member:', error);
        return null;
      }
}

export default blockUser;