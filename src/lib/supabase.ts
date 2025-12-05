import { createClient } from '@supabase/supabase-js';

// These load the values from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// This creates the connection client for your entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);