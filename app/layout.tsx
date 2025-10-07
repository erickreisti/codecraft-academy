// app/layout.tsx

/**
 * LAYOUT RAIZ - Componente mais importante do Next.js App Router
 *
 * Este componente envolve TODAS as páginas da aplicação
 * É renderizado uma única vez e compartilhado entre todas as rotas
 *
 * Responsabilidades:
 * - Define a estrutura HTML base de todas as páginas
 * - Configura metadados para SEO (title, description)
 * - Aplica fonte global e estilos base
 * - Fornece os context providers (tema, autenticação, etc)
 * - Define atributos globais como idioma
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

// Configuração da fonte Inter do Google Fonts
const inter = Inter({
  subsets: ["latin"], // Carrega apenas caracteres latinos (otimização de performance)
  display: "swap", // Estratégia de display para melhor performance
});

// Metadados para SEO - Aparecem nos resultados do Google e redes sociais
export const metadata: Metadata = {
  title: "CodeCraft Academy - Aprenda Programação do Zero",
  description:
    "Plataforma de cursos online de programação, design e carreira tech.",
  // Futuros metadados a adicionar:
  // - openGraph (para redes sociais)
  // - twitterCard
  // - icons
  // - manifest (PWA)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={inter.className}>
        {/* PROVIDERS: Contextos de Tema, Autenticação, etc */}
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* CONTEÚDO DINÂMICO DAS PÁGINAS */}
            {children}

            {/* FOOTER FIXO EM TODAS AS PÁGINAS */}
            <Footer />

            {/* TOASTER: Sistema de Notificações */}
            <Toaster
              position="top-right"
              duration={3000}
              closeButton
              richColors
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
