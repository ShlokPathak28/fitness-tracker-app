import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a mock client when env vars are not configured (demo mode)
const createMockClient = () => {
  const handler = {
    get: () => {
      return new Proxy(() => {}, {
        get: () => handler.get(),
        apply: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      });
    },
  };
  return new Proxy({}, handler);
};

const isConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here';

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export const isSupabaseConfigured = isConfigured;
