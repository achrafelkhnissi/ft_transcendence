import axios from "axios";

const getAllUsersStatus = async () => {
    try {
        const {data} = await axios(process.env.BACKEND + '/api/users/all', {withCredentials: true});
        return data;
    }
    catch (error) {
        console.log('error getting all users',error);
        return null;
    }
}

export default getAllUsersStatus;