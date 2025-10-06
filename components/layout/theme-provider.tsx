// components/layout/theme-provider.tsx

"use client"; // Indica que este componente roda no lado do cliente

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Provedor de Tema - Gerenciamento de modo claro/escuro
 *
 * Este componente envolve a aplicação com o provedor de temas
 * do next-themes, permitindo alternar entre temas claro, escuro
 * e seguir a preferência do sistema
 *
 * Props do NextThemesProvider:
 * - attribute: Atributo HTML onde a classe do tema será aplicada
 * - defaultTheme: Tema padrão caso não haja preferência salva
 * - enableSystem: Respeita a preferência do sistema operacional
 * - disableTransitionOnChange: Remove animação ao mudar temas (evita flash)
 */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class" // Aplica tema via classes CSS (ex: 'dark')
      defaultTheme="system" // Usa preferência do sistema como padrão
      enableSystem // Habilita detecção automática do sistema
      disableTransitionOnChange // Remove transição ao mudar tema
    >
      {children}
    </NextThemesProvider>
  );
}
