import axios from 'axios';

async function getAllRooms() {
    try{
        const { data } = await axios.get(process.env.BACKEND + `/api/users/chat`, {
          withCredentials: true,
        });
        return data;
    }
    catch (error) {
        console.log('error getting all rooms', error);
        return null;
    }

}

export default getAllRooms;
