// lib/supabase/client.ts

import { createClient } from "@supabase/supabase-js";

/**
 * Configuração do cliente Supabase para ambiente do navegador
 *
 * Este arquivo cria e exporta uma instância do cliente Supabase
 * que será usada em componentes React no lado do cliente
 *
 * Variáveis de ambiente:
 * - NEXT_PUBLIC_SUPABASE_URL: URL do projeto no Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Chave pública para autenticação
 */

// Obtém as credenciais do Supabase das variáveis de ambiente
// O '!' no final indica que temos certeza que estas variáveis existem
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cria e exporta a instância do cliente Supabase
// Esta instância será usada para todas as operações no frontend
// como autenticação, consultas ao banco, etc.
export const supabase = createClient(supabaseUrl, supabaseKey);
