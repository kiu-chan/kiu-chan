const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export const sendConfirmationEmail = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/api/send-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};