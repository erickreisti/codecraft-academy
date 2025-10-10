// lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";
import { createServerClient as createSupabaseSSRClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function ensureAuthCookies() {
  const supabase = createServerClientForServerComponent();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // Forçar refresh da sessão para garantir cookies
    await supabase.auth.refreshSession();
    return true;
  }
  return false;
}

// Função para Server Components (com cookies)
export function createServerClientForServerComponent() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Erro: Variáveis de ambiente do Supabase não definidas.");
  }

  return createSupabaseSSRClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        const cookieStore = cookies();
        return cookieStore.get(name)?.value;
      },
    },
  });
}

// Função para operações administrativas (SERVICE_ROLE_KEY)
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variáveis de ambiente do Supabase não definidas.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

// Função para Middleware (mantida para compatibilidade)
export function createServerClientForMiddleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Erro: Variáveis de ambiente do Supabase não definidas.");
  }

  return createSupabaseSSRClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
    },
  });
}

// Função de compatibilidade (alias)
export function createServerClient() {
  return createServerClientForServerComponent();
}
