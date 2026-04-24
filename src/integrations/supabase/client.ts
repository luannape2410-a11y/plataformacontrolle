import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

console.log("--- DEBUG FINAL ---");
console.log("Link capturado:", supabaseUrl);

export const supabase = createClient(
  supabaseUrl || "", 
  supabaseKey || ""
);
