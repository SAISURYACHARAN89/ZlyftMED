import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const socket = io('http://localhost:5000');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Individual exports for App.jsx compatibility
export const getDeliveries = (hospitalId) => api.get(`/deliveries${hospitalId ? `?hospitalId=${hospitalId}` : ''}`);
export const getDrones = () => api.get('/drones');
export const createDelivery = (data) => api.post('/deliveries', data);
export const updateDeliveryStatus = (id, status) => api.patch(`/deliveries/${id}/status`, { status });

// Grouped exports for organization
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => localStorage.removeItem('token')
};

export const deliveries = {
  getAll: getDeliveries,
  create: createDelivery,
  updateStatus: updateDeliveryStatus,
  approve: (id) => api.patch(`/deliveries/${id}/status`, { status: 'approved' }),
  reject: (id) => api.patch(`/deliveries/${id}/status`, { status: 'rejected' })
};


export const drones = {
  getAll: () => api.get('/drones'),
  create: (data) => userRole === 'admin' ? api.post('/drones', data) : Promise.reject('Unauthorized'),
  updateStatus: (id, status) => userRole === 'admin' ? api.patch(`/drones/${id}/status`, { status }) : Promise.reject('Unauthorized')
};

export const subscribeToUpdates = (callbacks) => {
  socket.on('delivery_update', callbacks.onDeliveryUpdate);
  socket.on('drone_update', callbacks.onDroneUpdate);
  socket.on('delivery_approval', callbacks.onDeliveryApproval);
  
  return () => {
    socket.off('delivery_update');
    socket.off('drone_update');
    socket.off('delivery_approval');
  };
};

export default api;
