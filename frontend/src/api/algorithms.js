import { api } from './client.js';

export const saveApiKey = (payload) => api.post('/keys', payload).then((res) => res.data);
export const listApiKeys = () => api.get('/keys').then((res) => res.data);
export const deleteApiKey = (provider) => api.delete(`/keys/${provider}`).then((res) => res.data);
export const visualize = (payload) => api.post('/algorithms/visualize', payload).then((res) => res.data);
export const getHistory = (params = {}) => api.get('/algorithms/history', { params }).then((res) => res.data);
export const getOne = (id) => api.get(`/algorithms/history/${id}`).then((res) => res.data);
export const deleteOne = (id) => api.delete(`/algorithms/history/${id}`).then((res) => res.data);
export const shareVisualization = (id) => api.post(`/share/${id}`).then((res) => res.data);
export const getShared = (token) => api.get(`/share/${token}`).then((res) => res.data);
