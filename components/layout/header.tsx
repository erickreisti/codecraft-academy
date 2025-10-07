// components/layout/header.tsx

/**
 * HEADER COM AUTENTICAÇÃO E CARRINHO - CodeCraft Academy
 *
 * Header responsivo que mostra estado de autenticação do usuário
 * Atualiza automaticamente quando usuário faz login/logout
 *
 * Funcionalidades:
 * - Logo com link para home
 * - Navegação principal
 * - Toggle de tema claro/escuro
 * - Ícone do carrinho com contador
 * - Estado de autenticação do usuário (exibe nome completo, link para dashboard com background chamativo)
 * - Sidebar do carrinho
 */

"use client"; // Necessário para hooks e efeitos

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { useCartStore } from "@/lib/stores/cart-store";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { ShoppingCart, User as UserIcon } from "lucide-react";

// Interface simplificada para o perfil do usuário (apenas o necessário)
interface UserProfile {
  full_name?: string;
}

export function Header() {
  // Estado para armazenar usuário logado
  const [user, setUser] = useState<User | null>(null);
  // Estado para armazenar o nome completo do usuário
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Store do carrinho
  const { getItemCount, setIsOpen } = useCartStore();

  /**
   * EFFECT PARA GERENCIAR AUTENTICAÇÃO E PERFIL
   * Executa quando componente é montado
   */
  useEffect(() => {
    let isSubscribed = true; // Flag para evitar setState após desmontagem

    // 1. Verifica se já existe uma sessão ativa e busca o perfil
    const checkSessionAndProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user && isSubscribed) {
        setUser(session.user);

        // Buscar o perfil do usuário no banco de dados
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          // Se houver erro, pode ser que o perfil ainda não exista, então definimos como null
          setUserProfile(null);
        } else {
          setUserProfile(profileData);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    };

    checkSessionAndProfile();

    // 2. Configura listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Atualiza estado do usuário
        if (isSubscribed) {
          setUser(session.user);

          // Busca o perfil do usuário logado
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Erro ao buscar perfil no evento de auth:", error);
            setUserProfile(null);
          } else {
            setUserProfile(profileData);
          }
        }
      } else {
        // Usuário deslogado
        if (isSubscribed) {
          setUser(null);
          setUserProfile(null);
        }
      }
    });

    // 3. Cleanup: remove listener e flag quando componente desmonta
    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []); // Array vazio = executa apenas uma vez

  /**
   * FUNÇÃO DE LOGOUT
   * Desloga usuário e atualiza estado
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // O listener onAuthStateChange vai atualizar automaticamente os estados setUser e setUserProfile
  };

  // Nome a ser exibido
  const displayName =
    userProfile?.full_name || user?.email?.split("@")[0] || "Aluno";

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* LOGO - Sempre visível */}
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

        {/* NAVEGAÇÃO PRINCIPAL - Oculto em mobile */}
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

        {/* ÁREA DE AÇÕES DO USUÁRIO */}
        <div className="flex items-center space-x-3">
          {/* Toggle de tema - sempre visível */}
          <ThemeToggle />

          {/* Botão do Carrinho - sempre visível */}
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setIsOpen(true)}
            asChild={getItemCount() > 0}
          >
            {getItemCount() > 0 ? (
              <Link href="/checkout">
                <ShoppingCart className="h-4 w-4" />
                {getItemCount() > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {getItemCount()}
                  </Badge>
                )}
              </Link>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {getItemCount() > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {getItemCount()}
                  </Badge>
                )}
              </>
            )}
          </Button>

          {/* CONDICIONAL: Mostra estado baseado no login */}
          {user ? (
            // USUÁRIO LOGADO: Mostra nome completo (ou parte do email), link para dashboard e botão sair
            <div className="flex items-center space-x-2">
              {/* Link para o Dashboard */}
              <Link href="/dashboard" className="hidden sm:inline">
                <Button
                  variant="secondary" // <--- AQUI: Usando 'secondary' para um background mais chamativo (definido em globals.css)
                  size="sm"
                  className="flex items-center gap-1 px-3 py-1.5 text-sm" // Ajuste fino de padding e texto para consistência
                >
                  <UserIcon className="h-4 w-4" /> {/* Ícone opcional */}
                  Dashboard
                </Button>
              </Link>
              {/* Nome do Usuário */}
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Olá, {displayName}
              </span>
              {/* Botão Sair */}
              <Button
                variant="outline"
                size="sm"
                className="btn btn-secondary"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          ) : (
            // USUÁRIO NÃO LOGADO: Mostra botões de login/cadastro
            <div className="hidden sm:flex items-center space-x-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn btn-secondary"
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="btn btn-primary">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}

          {/* MENU MOBILE - Placeholder para futuro menu hamburger */}
          <button className="md:hidden p-2 rounded-md hover:bg-muted transition-colors">
            <div className="w-5 h-5 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-foreground rounded"></span>
              <span className="w-full h-0.5 bg-foreground rounded"></span>
              <span className="w-full h-0.5 bg-foreground rounded"></span>
            </div>
          </button>
        </div>
      </div>

      {/* BORDER GRADIENT DECORATIVA */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

      {/* Sidebar do Carrinho */}
      <CartSidebar />
    </header>
  );
}
