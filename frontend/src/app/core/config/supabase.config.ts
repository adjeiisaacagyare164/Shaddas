import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type ShaddasRuntimeConfig = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

const runtimeConfig = (globalThis as typeof globalThis & {
  __SHADDAS_CONFIG__?: ShaddasRuntimeConfig;
}).__SHADDAS_CONFIG__ ?? {};

export const SUPABASE_URL = runtimeConfig.supabaseUrl?.trim() ?? '';
export const SUPABASE_ANON_KEY = runtimeConfig.supabaseAnonKey?.trim() ?? '';

export const HAS_SUPABASE_CONFIG = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabaseClient: SupabaseClient | null = HAS_SUPABASE_CONFIG
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error('Configure supabaseUrl and supabaseAnonKey in runtime-config.js to connect Shaddas to Supabase.');
  }
  return supabaseClient;
}
