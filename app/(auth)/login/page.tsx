// app/login/page.tsx - CORREÇÃO DO REDIRECIONAMENTO
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner"; // ✅ Adicionar import

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
      } else if (data?.user) {
        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando para o dashboard...",
        });

        // ✅ CORREÇÃO: Redirecionamento direto e simples
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("💥 ERRO CATCH:", err);
      setError("Erro ao fazer login");
      toast.error("Erro inesperado", {
        description: "Tente novamente",
      });
    } finally {
      setLoading(false);
    }
  };

  // ... resto do código permanece igual
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
              {error}
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
            />
          </div>

          <Button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Links */}
        <div className="text-center space-y-4">
          <Link href="/register" className="block text-primary hover:underline">
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
