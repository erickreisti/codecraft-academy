"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/95 backdrop-blur">
      <div className="container-custom">
        {/* Main Footer */}
        <div className="section-py grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center">
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
            <p className="text-muted-foreground text-sm mb-4">
              Aprenda programação do zero ao profissional com cursos práticos e
              mentoria especializada.
            </p>
            <div className="flex space-x-3">
              {/* Social Links - Placeholder */}
              <Button variant="ghost" size="icon" className="btn btn-ghost">
                <span>📘</span>
              </Button>
              <Button variant="ghost" size="icon" className="btn btn-ghost">
                <span>📷</span>
              </Button>
              <Button variant="ghost" size="icon" className="btn btn-ghost">
                <span>🐦</span>
              </Button>
            </div>
          </div>

          {/* Cursos */}
          <div>
            <h3 className="font-semibold mb-4">Cursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/courses?category=frontend"
                  className="hover:text-primary transition-colors"
                >
                  Frontend
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=backend"
                  className="hover:text-primary transition-colors"
                >
                  Backend
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=fullstack"
                  className="hover:text-primary transition-colors"
                >
                  Fullstack
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=mobile"
                  className="hover:text-primary transition-colors"
                >
                  Mobile
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-primary transition-colors"
                >
                  Carreiras
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/help"
                  className="hover:text-primary transition-colors"
                >
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} CodeCraft Academy. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span>Feito com 💙 para devs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
