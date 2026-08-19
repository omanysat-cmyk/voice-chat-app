import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  searchUsers: (query: string) => api.get(`/users/search/${query}`),
};

export const chatAPI = {
  getChats: () => api.get('/chats'),
  getPrivateChat: (userId: string) => api.post(`/chats/private/${userId}`),
  createGroupChat: (data: any) => api.post('/chats/group', data),
  getChatById: (chatId: string) => api.get(`/chats/${chatId}`),
};

export const messageAPI = {
  getMessages: (chatId: string, page: number = 1, limit: number = 50) =>
    api.get(`/messages/chat/${chatId}?page=${page}&limit=${limit}`),
  sendMessage: (data: any) => api.post('/messages', data),
  markAsRead: (messageId: string) => api.put(`/messages/${messageId}/read`),
  deleteMessage: (messageId: string) => api.delete(`/messages/${messageId}`),
};

export default api;
