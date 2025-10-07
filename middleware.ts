// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server"; // Importar o client do server

export async function middleware(request: NextRequest) {
  // Verificar se a rota é administrativa
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const response = NextResponse.next(); // Cria a resposta padrão
    const supabase = createServerClient(); // Cria o cliente do Supabase

    // Chama a função para obter o usuário autenticado
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Se houver erro ou não houver usuário, redireciona para login
    if (error || !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // TODO: Verificar papel de admin (ex: user.user_metadata.role === 'admin')
    // Por enquanto, apenas verificar se está logado
    // Se não for admin, retornar erro 403
    // const {  profile } = await supabase
    //   .from("profiles")
    //   .select("role")
    //   .eq("id", user.id)
    //   .single();
    // if (profile?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    // }

    return response; // Retorna a resposta padrão se estiver logado
  }

  // Para outras rotas (que não são /admin), continuar normalmente
  return NextResponse.next();
}

// Define os caminhos que o middleware deve interceptar
export const config = {
  matcher: ["/admin/:path*"], // Protege todas as subrotas de /admin
  // Você pode adicionar outras rotas aqui se quiser protegê-las também
  // Ex: matcher: ["/admin/:path*", "/dashboard/:path*"],
};
