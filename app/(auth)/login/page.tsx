// app/login/page.tsx - VERSÃO SEM DEBUG E SEM ERROS ESLINT
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

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
          description: "Redirecionando para o dashboard...",
        });

        // Redirecionamento após sucesso
        setTimeout(() => {
          window.location.replace("/dashboard");
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
            <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-2xl gradient-text">CodeCraft</span>
          </Link>

          <h1 className="text-3xl font-bold">Entre na sua conta</h1>
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        {/* Links de Navegação */}
        <div className="text-center space-y-4">
          <Link
            href="/register"
            className="block text-primary hover:underline font-medium"
          >
            Não tem conta? Cadastre-se
          </Link>
          <Link
            href="/forgot-password"
            className="block text-muted-foreground hover:underline text-sm"
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </div>
    </div>
  );
}
