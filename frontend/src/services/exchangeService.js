import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get current user
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Exchange Service Functions
const exchangeService = {
  // Create a new exchange request
  createExchange: async (exchangeData) => {
    try {
      const response = await api.post('/exchanges', exchangeData);
      return response.data;
    } catch (error) {
      console.error('❌ Create exchange error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Get all exchanges for current user
  getUserExchanges: async () => {
    try {
      const response = await api.get('/exchanges/user');
      return response.data;
    } catch (error) {
      console.error('❌ Get exchanges error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Get exchange by ID
  getExchangeById: async (id) => {
    try {
      const response = await api.get(`/exchanges/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get exchange error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Accept an exchange request (Provider)
  acceptExchange: async (id) => {
    try {
      const response = await api.put(`/exchanges/${id}/accept`);
      return response.data;
    } catch (error) {
      console.error('❌ Accept exchange error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Complete an exchange
  completeExchange: async (id) => {
    try {
      const response = await api.put(`/exchanges/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('❌ Complete exchange error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Cancel an exchange
  cancelExchange: async (id) => {
    try {
      const response = await api.put(`/exchanges/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('❌ Cancel exchange error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Update exchange status
  updateExchangeStatus: async (id, status) => {
    try {
      const response = await api.put(`/exchanges/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('❌ Update exchange status error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },
};

export default exchangeService;