import axios from "axios";

const setNotifAsRead = async (notifId: number) => {
    try{
        const { data } = await axios(
          process.env.BACKEND + `/api/users/notifications/${notifId}/read`,
          { withCredentials: true },
        );
        return data;
    }
    catch (error) {
        console.log("Error setting notification as read: ", error);
        return null;
    }
};
export default setNotifAsRead;
