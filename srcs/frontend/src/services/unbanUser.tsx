import axios from "axios";

const unbanUser = async (userId: number | undefined , channelId : number) => {
    try {
        const { data } = await axios.post(
          `${process.env.BACKEND}/api/users/chat/${channelId}/unban`,
          { userId: userId },
          { withCredentials: true },
        );
        return data;
      } catch (error) {
        console.log('Error unbanning member:', error);
        return null;
      }
}

export default unbanUser;