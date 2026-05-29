import { api } from './client.js';

export const register = (payload) => api.post('/auth/register', payload).then((res) => res.data);
export const login = (payload) => api.post('/auth/login', payload).then((res) => res.data);
export const logoutRequest = (refreshToken) => api.post('/auth/logout', { refresh_token: refreshToken }).then((res) => res.data);
export const getMe = () => api.get('/auth/me').then((res) => res.data);
