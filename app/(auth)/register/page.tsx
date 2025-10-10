// app/register/page.tsx - VERSÃO FINAL CORRIGIDA
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        toast.error("Erro no cadastro", {
          description: error.message,
        });
        return;
      }

      if (data?.user) {
        toast.success("Cadastro realizado com sucesso!", {
          description: "Verifique seu email para confirmar a conta.",
        });

        setTimeout(() => {
          window.location.replace("/login");
        }, 2000);
      }
    } catch {
      setError("Erro inesperado ao criar conta");
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

          <h1 className="text-3xl font-bold gradient-text">Crie sua conta</h1>
          <p className="text-muted-foreground mt-2">
            Comece sua jornada em programação
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleRegister} className="space-y-6">
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="border-border focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-foreground font-medium"
            >
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Digite novamente sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Criando conta...
              </div>
            ) : (
              "🎉 Criar Minha Conta"
            )}
          </Button>
        </form>

        {/* Links de Navegação */}
        <div className="text-center pt-4">
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Já tem conta? <span className="font-semibold">Faça login</span>
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
