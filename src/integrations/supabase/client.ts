import { createClient } from '@supabase/supabase-js';

// 1. Pegamos os valores (Usando os nomes que você configurou no Vercel/GitHub)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// 2. Log para a gente comemorar no F12
console.log("--- DEBUG FINAL ---");
console.log("Link capturado:", supabaseUrl);

// 3. A ÚNICA FORMA de dar erro agora é se os nomes acima estiverem diferentes do que você digitou no painel
export const supabase = createClient(
  supabaseUrl || "", 
  supabaseKey || ""
);
