
import axios from 'axios';
import FormData from 'form-data';

const uploadChannelImage = async (newImage: File | null) => {
  try {
    const filePath = newImage?.webkitRelativePath || '';

    // Create an instance of FormData
    const formData = new FormData();

    // Append the file to the form data under the key 'image'
    formData.append('image', newImage);

    // Send a POST request and wait for the response
    const response = await axios.post(process.env.BACKEND + '/api/upload/channel-avatar', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the response data directly
    return response.data;
  } catch (error) {
    // Handle errors here or rethrow them if necessary
    console.log('File upload failed', error);
  }
};

export default uploadChannelImage;
