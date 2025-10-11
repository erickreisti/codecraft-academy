// app/layout.tsx - VERSÃO CORRIGIDA
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { ClientOnly } from "@/components/ui/client-only";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeCraft Academy - Aprenda Programação do Zero",
  description:
    "Plataforma de cursos online de programação, design e carreira tech.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {children}
            <Footer />
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
