import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,      // ← saves session to localStorage
      autoRefreshToken: true,    // ← automatically refreshes expired tokens
      detectSessionInUrl: true,  // ← handles OAuth redirects
    }
  }
);

export default supabase;