const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Funkcja do wysyłania żądań z tokenem
export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      let errorMsg = 'Błąd API';
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        // Jeśli response nie jest JSON (np. HTML), pokarz status
        errorMsg = `Błąd serwera: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Błąd API (${endpoint}):`, err);
    throw err;
  }
};

// Export dla użyteczności
export default { apiCall };
