import axios from "axios";

const banUser = async (userId: number | undefined , channelId : number) => {
    try {
        const { data } = await axios.post(
          `${process.env.BACKEND}/api/users/chat/${channelId}/ban`,
          { userId: userId },
          { withCredentials: true },
        );
        return data;
      } catch (error) {
        console.log('Error banning member:', error);
        return null;
      }
}

export default banUser;