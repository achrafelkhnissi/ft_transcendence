import axiosInstance from './axios';

async function getConversations(id?: number) {
  let response;
  if (!id) {
    response = axiosInstance.get(`/api/users/chat/me`);
  } else {
    response = axiosInstance.get(`/api/users/chat/${id}`);
  }
  return response;
}

export default getConversations;
