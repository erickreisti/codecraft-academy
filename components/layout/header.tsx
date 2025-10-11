// components/layout/header.tsx - VERSÃO SEM ÍCONES NOS LINKS

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { useCartStore } from "@/lib/stores/cart-store";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserAvatar } from "@/components/user/user-avatar";
import {
  ShoppingCart,
  User as UserIcon,
  Moon,
  Sun,
  Monitor,
  Menu,
  Sparkles,
} from "lucide-react";

interface UserProfile {
  full_name?: string;
  avatar_url?: string;
}

function ThemeToggleWithDropdown() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("system");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName: string) => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (themeName === "dark" || (themeName === "system" && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled className="h-9 w-9">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 relative transition-all duration-300 hover:scale-110 hover:shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Selecionar tema"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-12 z-50 w-40 rounded-xl border bg-background/95 backdrop-blur p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
            <div className="space-y-1">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105 ${
                  theme === "light"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    : ""
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Claro</span>
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105 ${
                  theme === "dark"
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    : ""
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>Escuro</span>
              </button>

              <button
                onClick={() => handleThemeChange("system")}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105 ${
                  theme === "system"
                    ? "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
                    : ""
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span>Sistema</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getItemCount, setIsOpen, _hasHydrated } = useCartStore();
  const [isReady, setIsReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Links de navegação SEM ÍCONES
  const navigationItems = [
    { href: "/", label: "Início" },
    { href: "/courses", label: "Cursos" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "Sobre" },
  ];

  useEffect(() => {
    setIsReady(_hasHydrated);
  }, [_hasHydrated]);

  useEffect(() => {
    let isSubscribed = true;
    setIsLoading(true);

    const checkSessionAndProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && isSubscribed) {
          setUser(session.user);

          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", session.user.id)
            .single();

          if (!error && profileData) {
            setUserProfile(profileData);
          } else {
            setUserProfile(null);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    checkSessionAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (!error && profileData) {
          setUserProfile(profileData);
        } else {
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center space-x-3 group flex-shrink-0"
        >
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-5">
              CodeCraft
            </span>
            <span className="text-xs text-muted-foreground leading-3 dark:text-gray-400">
              Academy
            </span>
          </div>
        </Link>

        {/* NAVEGAÇÃO PRINCIPAL - SEM ÍCONES */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 relative py-2 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* ÁREA DE AÇÕES DO USUÁRIO */}
        <div className="flex items-center space-x-2">
          {/* Toggle de tema */}
          <ThemeToggleWithDropdown />

          {/* Botão do Carrinho */}
          {isReady ? (
            <Button
              variant="outline"
              size="icon"
              className="relative h-9 w-9 transition-all duration-300 hover:scale-110 hover:shadow-md"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {getItemCount() > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce"
                >
                  {getItemCount()}
                </Badge>
              )}
            </Button>
          ) : (
            <Button variant="outline" size="icon" className="h-9 w-9" disabled>
              <ShoppingCart className="h-4 w-4 opacity-50" />
            </Button>
          )}

          {/* Estados de autenticação */}
          {isLoading ? (
            // Loading state
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
              <div className="hidden sm:flex space-x-2">
                <div className="w-20 h-9 rounded-md bg-muted animate-pulse"></div>
                <div className="w-16 h-9 rounded-md bg-muted animate-pulse"></div>
              </div>
            </div>
          ) : user ? (
            // Usuário logado
            <div className="flex items-center space-x-2">
              {/* Dashboard button - apenas desktop */}
              <Link href="/dashboard" className="hidden sm:inline">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 hover:scale-105"
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
              </Link>

              {/* Avatar do usuário */}
              <UserAvatar size="md" showName={true} />

              {/* Botão Sair */}
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex btn btn-secondary hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          ) : (
            // Usuário não logado
            <div className="hidden sm:flex items-center space-x-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn btn-secondary transition-all duration-300 hover:scale-105"
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}

          {/* MENU MOBILE */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden h-9 w-9 transition-all duration-300 hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* MENU MOBILE EXPANDIDO - SEM ÍCONES */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top duration-300">
          <div className="container-custom py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary transition-all duration-200 rounded-lg hover:bg-accent/50 border border-transparent hover:border-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Ações mobile para usuário não logado */}
            {!user && !isLoading && (
              <div className="pt-2 border-t space-y-2">
                <Link href="/login" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" className="block w-full">
                  <Button
                    className="w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}

            {/* Ações mobile para usuário logado */}
            {user && !isLoading && (
              <div className="pt-2 border-t space-y-2">
                <Link href="/dashboard" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sair
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BORDER GRADIENT DECORATIVA */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent dark:via-purple-500/40"></div>

      {/* Sidebar do Carrinho */}
      <CartSidebar />
    </header>
  );
}
