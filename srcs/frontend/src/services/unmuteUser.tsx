import axios from "axios";

const unmuteUser = async (userId: number | undefined , channelId: number) => {
    try {
        const { data } = await axios.post(
          `${process.env.BACKEND}/api/users/chat/${channelId}/unmute`,
          { userId: userId },
          { withCredentials: true },
        );
        return data;
      } catch (error) {
        console.log('Error adding member:', error);
        return null;
      }
}

export default unmuteUser;