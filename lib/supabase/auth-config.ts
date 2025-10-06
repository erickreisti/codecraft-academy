/**
 * CONFIGURAÇÃO DO CLIENTE SUPABASE PARA AUTENTICAÇÃO
 *
 * Este arquivo cria uma instância especializada do Supabase
 * com configurações otimizadas para autenticação
 */

import { createClient } from "@supabase/supabase-js";

// Cria cliente Supabase com configurações específicas para auth
export const supabaseAuth = createClient(
  // URL do projeto Supabase
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Chave pública para operações no cliente
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // Atualiza automaticamente o token quando expira
      autoRefreshToken: true,
      // Mantém a sessão salva no localStorage
      persistSession: true,
      // Detecta sessão em URLs (para confirmação de email)
      detectSessionInUrl: true,
    },
  }
);
