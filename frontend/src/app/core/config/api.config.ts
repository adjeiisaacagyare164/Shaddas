type RuntimeConfig = {
  apiUrl?: string;
};

const runtimeConfig = (globalThis as typeof globalThis & { __SHADDAS_CONFIG__?: RuntimeConfig }).__SHADDAS_CONFIG__;
const browserHost = typeof window === 'undefined' ? '' : window.location.hostname;
const configuredApiUrl = runtimeConfig?.apiUrl?.trim().replace(/\/$/, '');

export const API_BASE_URL = configuredApiUrl || (browserHost === 'localhost' || browserHost === '127.0.0.1'
  ? 'http://localhost:8000/api'
  : '/api');
