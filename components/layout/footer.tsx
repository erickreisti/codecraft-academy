// components/layout/footer.tsx

/**
 * FOOTER - Rodapé da aplicação
 *
 * Componente de rodapé com:
 * - Logo e descrição da marca
 * - Links organizados por categorias
 * - Links de redes sociais
 * - Copyright e informações legais
 * - Design responsivo
 * - Modo dark aprimorado
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Github,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Heart,
  Code2,
  Rocket,
  BookOpen,
  Users,
  Shield,
  HelpCircle,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/codecraft-academy",
      color: "hover:text-gray-700 dark:hover:text-gray-300",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/codecraft",
      color: "hover:text-blue-500 dark:hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/codecraft",
      color: "hover:text-pink-600 dark:hover:text-pink-400",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://youtube.com/codecraft",
      color: "hover:text-red-600 dark:hover:text-red-400",
    },
  ];

  const courseLinks = [
    { name: "Frontend", href: "/courses?category=frontend", icon: Code2 },
    { name: "Backend", href: "/courses?category=backend", icon: Server },
    { name: "Fullstack", href: "/courses?category=fullstack", icon: Rocket },
    { name: "Mobile", href: "/courses?category=mobile", icon: Smartphone },
  ];

  const companyLinks = [
    { name: "Sobre nós", href: "/about", icon: Users },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Carreiras", href: "/careers", icon: Briefcase },
    { name: "Contato", href: "/contact", icon: Mail },
  ];

  const supportLinks = [
    { name: "Central de Ajuda", href: "/help", icon: HelpCircle },
    { name: "Privacidade", href: "/privacy", icon: Shield },
    { name: "Termos de Uso", href: "/terms", icon: FileText },
    { name: "FAQ", href: "/faq", icon: MessageCircle },
  ];

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="container-custom">
        {/* Main Footer - Grid com 4 colunas em desktop */}
        <div className="section-py grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand - Coluna da marca */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-6">
                  CodeCraft
                </span>
                <span className="text-sm text-muted-foreground leading-4 dark:text-gray-400">
                  Academy
                </span>
              </div>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed dark:text-gray-400">
              Aprenda programação do zero ao profissional com cursos práticos,
              projetos reais e mentoria especializada. Transforme sua carreira
              em tecnologia.
            </p>

            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className={`btn btn-ghost h-10 w-10 transition-all duration-300 hover:scale-110 ${social.color}`}
                  asChild
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Cursos - Links para categorias de cursos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground dark:text-white">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Cursos
            </h3>
            <ul className="space-y-3">
              {courseLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 group dark:text-gray-400 dark:hover:text-white"
                  >
                    <link.icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa - Links institucionais */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground dark:text-white">
              <Users className="h-5 w-5 text-purple-600" />
              Empresa
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 group dark:text-gray-400 dark:hover:text-white"
                  >
                    <link.icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte - Links de ajuda e legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground dark:text-white">
              <Shield className="h-5 w-5 text-green-600" />
              Suporte
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 group dark:text-gray-400 dark:hover:text-white"
                  >
                    <link.icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer - Copyright e informações legais */}
        <div className="border-t py-8 flex flex-col lg:flex-row justify-between items-center gap-4 dark:border-gray-800">
          <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-400">
            <p>
              © {currentYear} CodeCraft Academy. Todos os direitos reservados.
            </p>
            <div className="hidden md:flex items-center gap-4">
              <span className="w-1 h-1 bg-muted-foreground rounded-full dark:bg-gray-600"></span>
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors dark:hover:text-white"
              >
                Privacidade
              </Link>
              <span className="w-1 h-1 bg-muted-foreground rounded-full dark:bg-gray-600"></span>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors dark:hover:text-white"
              >
                Termos
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
            <span>para a comunidade dev</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Ícones adicionais necessários
function Server({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
      />
    </svg>
  );
}

function Smartphone({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}

function Briefcase({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
      />
    </svg>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function MessageCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}
