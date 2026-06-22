import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are set and not placeholder values
const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('your_supabase_url') &&
  !SUPABASE_ANON_KEY.includes('your_supabase_anon_key');

let supabaseClient;

if (isConfigured) {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn("Supabase is not configured. Running in Local Demo Mode.");
  
  // Safe mock client to prevent page crashes during public template preview
  supabaseClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Demo mode: Database not connected.') }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null, count: 0 }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      order: () => Promise.resolve({ data: [], error: null }),
      limit: () => Promise.resolve({ data: [], error: null }),
      match: () => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
    }),
    channel: () => ({
      subscribe: (callback) => {
        if (callback) callback('SUBSCRIBED');
        return { track: () => {} };
      },
      track: () => {}
    }),
    removeChannel: () => {}
  };
}

export const supabase = supabaseClient;
