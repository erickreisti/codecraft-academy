// components/layout/header.tsx - DESIGN PREMIUM CORRIGIDO

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
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse"></div>
    );
  }

  return (
    <div className="relative">
      <button
        className="group relative w-9 h-9 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Selecionar tema"
      >
        <div className="relative w-5 h-5">
          <Sun className="w-4 h-4 text-amber-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute inset-0 m-auto" />
          <Moon className="w-4 h-4 text-blue-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute inset-0 m-auto" />
        </div>

        {/* Efeito de brilho */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-3 shadow-2xl animate-in fade-in-0 zoom-in-95">
            <div className="space-y-2">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 group ${
                  theme === "light"
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 dark:from-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    theme === "light"
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                </div>
                <span className="font-medium">Claro</span>
                {theme === "light" && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 group ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                </div>
                <span className="font-medium">Escuro</span>
                {theme === "dark" && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                )}
              </button>

              <button
                onClick={() => handleThemeChange("system")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-300 group ${
                  theme === "system"
                    ? "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 dark:from-gray-800/20 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    theme === "system"
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                </div>
                <span className="font-medium">Sistema</span>
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
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300 hover:scale-105 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          <UserAvatar size="md" showName={false} />
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-3 shadow-2xl animate-in fade-in-0 zoom-in-95">
            <div className="space-y-2">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Minha Conta
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Gerencie sua conta
                </p>
              </div>

              <Link href="/dashboard">
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 dark:text-gray-300 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">Dashboard</span>
                </button>
              </Link>

              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 group"
              >
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <X className="h-4 w-4" />
                </div>
                <span className="font-medium">Sair</span>
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

  const cartItemCount = isReady ? getItemCount() : 0;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-black/5 border-b border-gray-200 dark:border-gray-800"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800"
      }`}
    >
      <div className="container-custom flex h-20 items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center space-x-4 group flex-shrink-0"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 rotate-0 group-hover:rotate-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-7">
              CodeCraft
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 leading-3 tracking-wider font-medium">
              ACADEMY
            </span>
          </div>
        </Link>

        {/* NAVEGAÇÃO PRINCIPAL - SEM ÍCONES */}
        <nav className="hidden md:flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-200 dark:border-gray-700 shadow-sm">
          {navigationItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 relative rounded-xl group hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
            >
              <span className="relative z-10">{item.label}</span>

              {/* Efeito de fundo hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 rounded-xl transition-all duration-300 group-hover:from-blue-500/5 group-hover:to-purple-500/5"></div>

              {/* Indicador ativo */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ))}
        </nav>

        {/* ÁREA DE AÇÕES DO USUÁRIO */}
        <div className="flex items-center space-x-3">
          {/* Toggle de tema */}
          <ThemeToggleWithDropdown />

          {/* Botão do Carrinho */}
          <button
            className="relative w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center group"
            onClick={() => setIsOpen(true)}
            disabled={!isReady}
            aria-label={`Carrinho de compras, ${cartItemCount} itens`}
          >
            <ShoppingCart className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-200" />

            {cartItemCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold border-2 border-white dark:border-gray-900 shadow-lg animate-pulse">
                {cartItemCount}
              </div>
            )}
          </button>

          {/* Estados de autenticação */}
          {isLoading ? (
            // Loading state
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse"></div>
              <div className="hidden sm:flex space-x-2">
                <div className="w-20 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse"></div>
                <div className="w-16 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse"></div>
              </div>
            </div>
          ) : user ? (
            // Usuário logado
            <div className="flex items-center space-x-3">
              {/* Dashboard button - apenas desktop */}
              <Link href="/dashboard" className="hidden sm:inline">
                <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </button>
              </Link>

              {/* Avatar do usuário com dropdown */}
              <UserDropdown user={user} onLogout={handleLogout} />
            </div>
          ) : (
            // Usuário não logado
            <div className="hidden sm:flex items-center space-x-3">
              <Link href="/login">
                <button className="px-6 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700">
                  Entrar
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
                  Cadastrar
                </button>
              </Link>
            </div>
          )}

          {/* MENU MOBILE */}
          <button
            className="md:hidden w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* MENU MOBILE EXPANDIDO - SEM ÍCONES */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl animate-in slide-in-from-top duration-500">
          <div className="container-custom py-6 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-6 py-4 text-base font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 text-center hover:scale-105 hover:shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Ações mobile para usuário não logado */}
            {!user && !isLoading && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <Link href="/login" className="block w-full">
                  <button
                    className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-base transition-all duration-300 hover:scale-105 hover:shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </button>
                </Link>
                <Link href="/register" className="block w-full">
                  <button
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cadastrar
                  </button>
                </Link>
              </div>
            )}

            {/* Ações mobile para usuário logado */}
            {user && !isLoading && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800">
                  <div className="user-avatar">
                    <UserAvatar size="md" showName={false} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Minha Conta
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Ver perfil
                    </span>
                  </div>
                </div>

                <Link href="/dashboard" className="block w-full">
                  <button
                    className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-base transition-all duration-300 hover:scale-105 hover:shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </button>
                </Link>
                <button
                  className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium text-base transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BORDER GRADIENT DECORATIVA - CORRIGIDA */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent dark:via-purple-500/20"></div>

      {/* Sidebar do Carrinho */}
      <CartSidebar />
    </header>
  );
}
