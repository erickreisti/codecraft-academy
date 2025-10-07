// lib/supabase/server.ts (ou seu nome equivalente)
import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // ✅ CORRETO: Usa a SERVICE_ROLE_KEY do ambiente do servidor
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Erro: Variáveis de ambiente do Supabase não definidas.");
  }

  return createClient(supabaseUrl, supabaseKey);
}
