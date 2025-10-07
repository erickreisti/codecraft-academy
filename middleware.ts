// middleware.ts - DESABILITADO TEMPORARIAMENTE
import { NextResponse } from "next/server";

export async function middleware() {
  // Middleware desabilitado - todas as rotas são permitidas
  // A verificação será feita nas páginas individuais
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
