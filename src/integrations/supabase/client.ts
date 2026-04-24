import { createClient } from '@supabase/supabase-js';

// Se as chaves não forem encontradas, ele usa uma string vazia para não travar o carregamento do site
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
