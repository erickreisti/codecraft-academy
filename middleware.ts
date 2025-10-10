// middleware.ts - VERSÃO MÍNIMA (OPCIONAL)
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Apenas um log para debug, sem bloqueio
  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("🔍 Acesso à rota admin:", request.nextUrl.pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
