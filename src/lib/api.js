import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getSettings = () => api.get('/settings').then(r => r.data);
export const saveApiKey = (key) => api.post('/settings/api-key', { api_key: key }).then(r => r.data);
export const deleteApiKey = () => api.delete('/settings/api-key').then(r => r.data);

export const searchTopics = (params) => api.post('/search', params).then(r => r.data);

export const generateIdeas = (topic, { exclude = [], perCategory = 6 } = {}) =>
  api.post('/generate-ideas', { topic, exclude, per_category: perCategory }).then(r => r.data);

export const analyzeMarket = ({ market, keyword, nicheCount = 5, keywordsPerNiche = 16 }) =>
  api.post('/market-analyze', { market, keyword, niche_count: nicheCount, keywords_per_niche: keywordsPerNiche }).then(r => r.data);

export const analyzeImage = (file, { maxResults = 20, excludeTopics = [] } = {}) => {
  const form = new FormData();
  form.append('file', file);
  form.append('max_results', maxResults);
  if (excludeTopics?.length) form.append('exclude_topics', JSON.stringify(excludeTopics));
  return api.post('/analyze-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const getSavedTopics = () => api.get('/saved-topics').then(r => r.data);
export const saveTopic = (topic) => api.post('/saved-topics', topic).then(r => r.data);
export const deleteSavedTopic = (id) => api.delete(`/saved-topics/${id}`).then(r => r.data);

export const getHistory = () => api.get('/history').then(r => r.data);
export const clearHistory = () => api.delete('/history').then(r => r.data);
