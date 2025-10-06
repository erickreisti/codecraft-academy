"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl gradient-text leading-5">
              CodeCraft
            </span>
            <span className="text-xs text-muted-foreground leading-3">
              Academy
            </span>
          </div>
        </Link>

        {/* Navegação */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 relative py-2 group"
          >
            Início
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link
            href="/courses"
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 relative py-2 group"
          >
            Cursos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 relative py-2 group"
          >
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 relative py-2 group"
          >
            Sobre
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Ações */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="btn btn-secondary btn-sm"
            >
              Entrar
            </Button>
            <Button size="sm" className="btn btn-primary btn-sm">
              Cadastrar
            </Button>
          </div>

          {/* Menu Mobile (placeholder) */}
          <button className="md:hidden p-2 rounded-md hover:bg-muted transition-colors">
            <div className="w-5 h-5 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-foreground rounded"></span>
              <span className="w-full h-0.5 bg-foreground rounded"></span>
              <span className="w-full h-0.5 bg-foreground rounded"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Border gradient decorativo */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </header>
  );
}
