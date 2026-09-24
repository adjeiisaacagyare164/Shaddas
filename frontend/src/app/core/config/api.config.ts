const browserHost = typeof window === 'undefined' ? '' : window.location.hostname;

export const API_BASE_URL = browserHost === 'localhost' || browserHost === '127.0.0.1'
  ? 'http://localhost:8000/api'
  : '/api';
