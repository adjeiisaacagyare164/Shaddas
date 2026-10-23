type RuntimeConfig = {
  provider?: 'supabase' | 'django';
  apiUrl?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

const runtimeConfig = (globalThis as typeof globalThis & { __SHADDAS_CONFIG__?: RuntimeConfig }).__SHADDAS_CONFIG__;
const browserHost = typeof window === 'undefined' ? '' : window.location.hostname;
const configuredApiUrl = runtimeConfig?.apiUrl?.trim().replace(/\/$/, '');

export const APP_BACKEND_PROVIDER = (runtimeConfig?.provider ?? 'supabase').toLowerCase();
export const HAS_SUPABASE_CONFIG = APP_BACKEND_PROVIDER === 'supabase' && !!runtimeConfig?.supabaseUrl && !!runtimeConfig?.supabaseAnonKey;

export const API_BASE_URL = configuredApiUrl || (browserHost === 'localhost' || browserHost === '127.0.0.1'
  ? 'http://localhost:8000/api'
  : '/api');
