update public.shops
set owner_id = 'OWNER_AUTH_USER_UUID'
where id = (select id from public.shops order by created_at limit 1);update public.shops
set owner_id = 'OWNER_AUTH_USER_UUID'
where id = (select id from public.shops order by created_at limit 1);import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY?.trim() || process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_PUBLISHABLE_KEY) in the hosting environment.');
}

const parsedUrl = new URL(supabaseUrl);
if (parsedUrl.protocol !== 'https:' && parsedUrl.hostname !== 'localhost' && parsedUrl.hostname !== '127.0.0.1') {
  throw new Error('SUPABASE_URL must use HTTPS outside local development.');
}
const jwtPayload = supabaseAnonKey.split('.')[1];
let isServiceRoleKey = supabaseAnonKey.startsWith('sb_secret_');
if (jwtPayload) {
  try {
    isServiceRoleKey ||= JSON.parse(Buffer.from(jwtPayload, 'base64url').toString('utf8')).role === 'service_role';
  } catch {
    // Invalid key formats are rejected by Supabase when the app connects.
  }
}

if (isServiceRoleKey) {
  throw new Error('A Supabase secret key cannot be used in the browser. Use the anon or publishable key.');
}

const runtimeConfig = `window.__SHADDAS_CONFIG__ = ${JSON.stringify({ supabaseUrl, supabaseAnonKey }, null, 2)};\n`;
writeFileSync(resolve('public/runtime-config.js'), runtimeConfig, 'utf8');
