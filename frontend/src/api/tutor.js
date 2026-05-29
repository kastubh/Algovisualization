import { api } from './client.js';

export const generateTutorScript = (visualizationId, payload) =>
  api.post(`/visualizations/${visualizationId}/tutor-script`, payload).then((res) => res.data);
