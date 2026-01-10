
import { createClient } from '@supabase/supabase-js';

// These will be populated by your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase Environment Variables. Please check .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
