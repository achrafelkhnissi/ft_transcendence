import axios from "axios";
import FormData from "form-data";
// import fs from 'fs';

const uploadAvatar = async (newAvatar: File | null) => {
    
    const filePath = newAvatar?.webkitRelativePath || '';

    // Create an instance of FormData
    const formData = new FormData();
    
    // Append the file to the form data under the key 'image'
    formData.append('image', newAvatar);
    
    // Send a POST request
    axios.post('http://localhost:3000/api/upload/avatar', formData, {
        
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
          }
    })
    .then((response) => {
        console.log('File uploaded successfully', response.data);
    })
    .catch((error) => {
        console.error('File upload failed', error);
    });
}

export default uploadAvatar;