// components/layout/header.tsx - DESIGN MELHORADO

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
  X,
  ChevronDown,
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
      <Button
        variant="outline"
        size="icon"
        disabled
        className="h-9 w-9 btn-secondary"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 relative btn-secondary hover-lift"
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

          <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-background/95 backdrop-blur p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
            <div className="space-y-1">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:scale-105 group ${
                  theme === "light"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    : "text-foreground"
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Claro</span>
                {theme === "light" && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                )}
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:scale-105 group ${
                  theme === "dark"
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                    : "text-foreground"
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>Escuro</span>
                {theme === "dark" && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-purple-500" />
                )}
              </button>

              <button
                onClick={() => handleThemeChange("system")}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:scale-105 group ${
                  theme === "system"
                    ? "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
                    : "text-foreground"
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span>Sistema</span>
                {theme === "system" && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-gray-500" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// User Dropdown Component
function UserDropdown({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-2 px-3 py-2 rounded-lg btn-ghost hover-lift"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          <UserAvatar size="md" showName={false} />
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-background/95 backdrop-blur p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
            <div className="space-y-1">
              <Link href="/dashboard">
                <button
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:scale-105 group text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-all duration-200 hover:bg-destructive/10 hover:scale-105 group"
              >
                <X className="h-4 w-4" />
                <span>Sair</span>
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
  const [scrolled, setScrolled] = useState(false);

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
        scrolled ? "shadow-lg shadow-black/5" : "shadow-sm"
      }`}
    >
      <div className="container-custom flex h-16 items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center space-x-3 group flex-shrink-0 hover-lift"
        >
          <div className="h-10 w-10 gradient-bg rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Sparkles className="h-5 w-5 text-white" />
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

        {/* NAVEGAÇÃO PRINCIPAL - SEM ÍCONES */}
        <nav className="hidden md:flex items-center space-x-1 bg-background/50 rounded-2xl p-1 border border-border/50">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 relative px-4 py-2 rounded-lg group hover:bg-accent/50"
            >
              {item.label}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
            </Link>
          ))}
        </nav>

        {/* ÁREA DE AÇÕES DO USUÁRIO */}
        <div className="flex items-center space-x-3">
          {/* Toggle de tema */}
          <ThemeToggleWithDropdown />

          {/* Botão do Carrinho */}
          {isReady ? (
            <Button
              variant="outline"
              size="icon"
              className="relative h-9 w-9 btn-secondary hover-lift"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {getItemCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 border-2 border-background animate-pulse">
                  {getItemCount()}
                </Badge>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 btn-secondary"
              disabled
            >
              <ShoppingCart className="h-4 w-4 opacity-50" />
            </Button>
          )}

          {/* Estados de autenticação */}
          {isLoading ? (
            // Loading state
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
              <div className="hidden sm:flex space-x-2">
                <div className="w-20 h-9 rounded-lg bg-muted animate-pulse"></div>
                <div className="w-16 h-9 rounded-lg bg-muted animate-pulse"></div>
              </div>
            </div>
          ) : user ? (
            // Usuário logado
            <div className="flex items-center space-x-3">
              {/* Dashboard button - apenas desktop */}
              <Link href="/dashboard" className="hidden sm:inline">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-secondary hover-lift flex items-center gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
              </Link>

              {/* Avatar do usuário com dropdown */}
              <UserDropdown user={user} onLogout={handleLogout} />
            </div>
          ) : (
            // Usuário não logado
            <div className="hidden sm:flex items-center space-x-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-secondary hover-lift"
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="btn-primary hover-lift">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}

          {/* MENU MOBILE */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden h-9 w-9 btn-secondary hover-lift"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* MENU MOBILE EXPANDIDO - SEM ÍCONES */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top duration-300">
          <div className="container-custom py-6 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary transition-all duration-200 rounded-lg hover:bg-accent/50 text-center hover-lift"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Ações mobile para usuário não logado */}
            {!user && !isLoading && (
              <div className="pt-4 border-t space-y-3">
                <Link href="/login" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-center btn-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" className="block w-full">
                  <Button
                    className="w-full justify-center btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}

            {/* Ações mobile para usuário logado */}
            {user && !isLoading && (
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/30">
                  <div className="user-avatar">
                    <UserAvatar size="md" showName={false} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Minha Conta</span>
                    <span className="text-xs text-muted-foreground">
                      Ver perfil
                    </span>
                  </div>
                </div>

                <Link href="/dashboard" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-center btn-secondary"
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
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent dark:via-purple-500/20"></div>

      {/* Sidebar do Carrinho */}
      <CartSidebar />
    </header>
  );
}
