import axios from 'axios';

const API_URL = 'http://localhost:3000/api/analyze';

export const analyzeData = async (file, target) => {
  const formData = new FormData();
  formData.append('file', file);
  if (target) {
    formData.append('target', target);
  }

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'An error occurred during analysis';
  }
};
