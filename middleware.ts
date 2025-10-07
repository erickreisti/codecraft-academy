// middleware.ts - VERSÃO FINAL CORRIGIDA
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
