import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aachoudpemjvgjqlvcqp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY2hvdWRwZW1qdmdqcWx2Y3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MDk5MTYsImV4cCI6MjEwNjM4NTkxNn0.npFo3UTNAsR4KGBufBAqdxI0g6DD2wQPuPZ-FfkhEro';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY2hvdWRwZW1qdmdqcWx2Y3FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDgwOTkxNiwiZXhwIjoyMTA2Mzg1OTE2fQ.le1-_-NFksw2Qtldo6LAASibtkgHaN59OEPD5w-C5GI';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side Supabase client (service role for admin bypassing RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const STORAGE_BUCKET = 'media';
