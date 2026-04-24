import { createClient } from '@supabase/supabase-js';

// Pegando os valores das variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

// Esse bloco ajuda a gente a enxergar o erro no Console (F12)
console.log("--- CHECK SUPABASE ---");
console.log("URL detectada:", supabaseUrl ? "SIM" : "NÃO (VAZIO)");
console.log("Key detectada:", supabasePublishableKey ? "SIM" : "NÃO (VAZIO)");
console.log("----------------------");

// Criando o cliente (o 'vazio' evita o erro de crash imediato)
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
