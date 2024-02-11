import axios from 'axios';

const addAdmin = async (userId: number | undefined, channelId: number) => {
    try {
        const { data } = await axios.post(
          `${process.env.BACKEND}/api/users/chat/${channelId}/admins/add`,
          { userId: userId },
          { withCredentials: true },
        );
        return data;
      } catch (error) {
        console.log('Error adding member:', error);
        return null;
      }
}

export default addAdmin;