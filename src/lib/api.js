import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api' });

export const getSettings = () => api.get('/settings').then(r => r.data);
export const saveApiKey = (key) => api.post('/settings/api-key', { api_key: key }).then(r => r.data);
export const deleteApiKey = () => api.delete('/settings/api-key').then(r => r.data);

export const searchTopics = (params) => api.post('/search', params).then(r => r.data);

export const getSavedTopics = () => api.get('/saved-topics').then(r => r.data);
export const saveTopic = (topic) => api.post('/saved-topics', topic).then(r => r.data);
export const deleteSavedTopic = (id) => api.delete(`/saved-topics/${id}`).then(r => r.data);

export const getHistory = () => api.get('/history').then(r => r.data);
export const clearHistory = () => api.delete('/history').then(r => r.data);
