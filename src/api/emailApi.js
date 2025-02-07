import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api'; // URL của backend server

export const sendConfirmationEmail = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-confirmation`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};