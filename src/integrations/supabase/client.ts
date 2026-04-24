import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";

console.log("--- CHECK SUPABASE ---");
console.log("URL detectada:", supabaseUrl ? "SIM" : "NÃO (VAZIO)");
console.log("Key detectada:", supabaseKey ? "SIM" : "NÃO (VAZIO)");
console.log("----------------------");

export const supabase = createClient(supabaseUrl, supabaseKey);
