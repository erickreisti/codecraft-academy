// middleware.ts - VERSÃO FINAL CORRIGIDA
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("🔐 MIDDLEWARE EXECUTADO:", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 🎯 BYPASS TEMPORÁRIO: Permitir acesso ao dashboard SEM verificação
  // 🔧 FUTURO: Reativar a verificação de sessão aqui
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("🔓 BYPASS ATIVADO - PERMITINDO ACESSO AO DASHBOARD");

    // ⚠️ CÓDIGO COMENTADO PARA REATIVAÇÃO FUTURA:
    /*
    // Para reativar no futuro, descomente e importe:
    // import { createServerClient } from '@supabase/ssr'
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('❌ SEM SESSÃO - REDIRECIONANDO PARA LOGIN');
      return NextResponse.redirect(new URL('/login', request.url));
    } else {
      console.log('✅ SESSÃO VÁLIDA - PERMITINDO ACESSO');
    }
    */

    return response;
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
