
import { createClient } from '@supabase/supabase-js';

// These will be populated by your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase Environment Variables. Please check .env file.');
}

// Fallback to prevent app crash if env vars are missing (common in new Vercel deploys)
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder';

export const supabase = createClient(
    supabaseUrl || fallbackUrl,
    supabaseAnonKey || fallbackKey
);
