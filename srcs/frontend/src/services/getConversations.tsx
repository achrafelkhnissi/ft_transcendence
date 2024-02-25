import axiosInstance from './axios';

async function getConversations(id?: number) {
  if (!id) {
    const {data} = await axiosInstance.get(`/api/users/chat/me`);
    return data;
  } else {
    const {data} = await axiosInstance.get(`/api/users/chat/${id}`);
    return data;
  }
}

export default getConversations;
