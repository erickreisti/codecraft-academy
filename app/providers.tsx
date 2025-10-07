// app/providers.tsx

/**
 * COMPONENTE PROVIDERS - Agrega todos os provedores de contexto
 *
 * Este componente centraliza todos os provedores de contexto da aplicação
 * em um único lugar, evitando o "provider hell" (aninhamento excessivo)
 *
 * Por que usar este padrão:
 * - Organiza todos os provedores em um só lugar
 * - Facilita manutenção e adição de novos provedores
 * - Mantém o layout principal limpo
 * - Seguindo boas práticas do Next.js e React
 */

"use client"; // Este componente roda no lado do cliente

import { ThemeProvider } from "@/components/layout/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
