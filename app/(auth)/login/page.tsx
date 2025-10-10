// app/login/page.tsx - VERSÃO FINAL CORRIGIDA
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error("Erro no login", {
          description: error.message,
        });
        return;
      }

      if (data?.user) {
        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando...",
        });

        const urlParams = new URLSearchParams(window.location.search);
        const redirectedFrom = urlParams.get("redirectedFrom");
        const redirectTo = redirectedFrom || "/dashboard";

        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1000);
      }
    } catch {
      setError("Erro inesperado ao fazer login");
      toast.error("Erro inesperado", {
        description: "Tente novamente",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Cabeçalho */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            {/* ✅ LOGO COM GRADIENTE CORRIGIDO */}
            <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-3xl gradient-text">CodeCraft</span>
          </Link>

          <h1 className="text-3xl font-bold gradient-text">
            Entre na sua conta
          </h1>
          <p className="text-muted-foreground mt-2">Acesse sua área de aluno</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span>❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="border-border focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="border-border focus:border-primary transition-colors"
            />
          </div>

          {/* ✅ BOTÃO COM GRADIENTE CORRIGIDO */}
          <Button
            type="submit"
            className="w-full gradient-bg hover:opacity-90 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2 justify-center">
                <Spinner
                  size="sm"
                  className="border-white border-t-transparent"
                />
                Entrando...
              </div>
            ) : (
              "🚀 Entrar na Plataforma"
            )}
          </Button>
        </form>

        {/* Links de Navegação */}
        <div className="text-center space-y-4 pt-4">
          <Link
            href="/register"
            className="block text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Não tem conta? <span className="font-semibold">Cadastre-se</span>
          </Link>
          <Link
            href="/forgot-password"
            className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        {/* Decoração visual */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
