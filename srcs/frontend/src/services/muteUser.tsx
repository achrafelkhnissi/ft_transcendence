import axios from "axios";

const muteUser = async (userId: number | undefined, channelId: number, muteDuration: string) => {
    try {
        const { data } = await axios.post(
          `${process.env.BACKEND}/api/users/chat/${channelId}/mute`,
          { userId: userId , duration: muteDuration},
          { withCredentials: true },
        );
        return data;
      } catch (error) {
        console.log('Error adding member:', error);
        return null;
      }
}

export default muteUser;