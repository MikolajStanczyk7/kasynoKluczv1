import { apiCall } from './api';

// Rejestracja
export const register = async (username, email, password) => {
  const response = await apiCall('/auth/register', 'POST', {
    username,
    email,
    password,
  });

  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  return response;
};

// Logowanie
export const login = async (email, password) => {
  const response = await apiCall('/auth/login', 'POST', {
    email,
    password,
  });

  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  return response;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Otrzymanie zalogowanego użytkownika
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Sprawdzenie czy jest zalogowany
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  isLoggedIn,
};
