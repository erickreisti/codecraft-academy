// lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // <--- Chave pública

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Erro: Variáveis de ambiente do Supabase não definidas.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
