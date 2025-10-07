import { createClient } from "@supabase/supabase-js";
// Importa função para criar cliente Supabase

export function createServerClient() {
  // Função que cria e retorna cliente Supabase para servidor
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Obtém URL do Supabase das variáveis de ambiente
  // ! indica que a variável definitivamente existe

  // ✅ Use Service Role Key para bypass RLS
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  // Obtém chave de serviço (service role key) para bypass do RLS
  // Esta chave tem privilégios elevados e NUNCA deve ser usada no cliente

  return createClient(supabaseUrl, supabaseKey);
  // Retorna instância do cliente Supabase configurada para servidor
}
