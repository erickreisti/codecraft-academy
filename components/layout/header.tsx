"use client"; // Usa hooks de estado (tema) e interatividade

/**
 * HEADER - Componente de navegação principal
 *
 * Funcionalidades:
 * - Logo e marca
 * - Menu de navegação
 * - Botão de tema claro/escuro
 * - Botões de autenticação
 * - Responsivo (mobile/desktop)
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/*
        Estilos especiais:
        - backdrop-blur: Efeito de vidro fosco
        - supports-[backdrop-filter]: Fallback para navegadores antigos
        - bg-background/95: Fundo levemente transparente
      */}

      <div className="container flex h-16 items-center justify-between">
        {/* LOGO - Link para página inicial */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg" />
          <span className="font-bold text-xl">CodeCraft</span>
        </Link>

        {/* NAVEGAÇÃO - Links principais (oculto em mobile) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Início
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Cursos
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Sobre
          </Link>
        </nav>

        {/* AÇÕES - Tema e autenticação */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            Entrar
          </Button>
          <Button size="sm">Cadastrar</Button>
        </div>
      </div>
    </header>
  );
}
