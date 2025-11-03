import axios from '../../config/axiosConfig';

export const uploadToCloudinary = async ({ token, file }) => {
  try {
    const form = new FormData();
    form.append('file', file);
    const response = await axios.post('/messages/upload', form, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response?.data?.data; // { url }
  } catch (error) {
    console.log('Error in uploading file', error);
  }
};

