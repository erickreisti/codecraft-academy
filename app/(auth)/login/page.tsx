// app/login/page.tsx - VERSÃO CORRIGIDA
"use client";

import { useState, useEffect } from "react";
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

  // 🔧 LIMPEZA AUTOMÁTICA DE SESSÕES CORROMPIDAS
  useEffect(() => {
    const clearStaleSession = async () => {
      try {
        console.log("🔄 Verificando sessões corrompidas...");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log("💥 Sessão corrompida detectada, limpando...");

          // Verificar se a sessão é realmente válida
          const { data: userData, error: userError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .single();

          if (userError || !userData) {
            console.log("🚮 Sessão inválida - limpando automaticamente");
            await supabase.auth.signOut();
            localStorage.removeItem("supabase.auth.token");
            sessionStorage.removeItem("supabase.auth.token");

            toast.info("Sessão anterior foi limpa", {
              description: "Faça login novamente.",
            });
          }
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        // Em caso de erro, limpar tudo por segurança
        await supabase.auth.signOut();
        localStorage.clear();
      }
    };

    clearStaleSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔄 Tentando login...", { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Erro login:", error);
        setError(error.message);
        toast.error("Erro no login", {
          description: error.message,
        });
        return;
      }

      if (data?.user) {
        console.log("✅ Login bem-sucedido!", data.user.email);

        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando para o dashboard...",
        });

        // ✅ CORREÇÃO: Redirecionamento mais robusto
        // Aguardar um pouco para garantir que a sessão foi salva
        setTimeout(() => {
          console.log("🔄 Redirecionando para /dashboard");
          // Usar replace em vez de href para evitar problemas de histórico
          window.location.replace("/dashboard");
        }, 1000);
      }
    } catch (err) {
      console.error("💥 ERRO CATCH:", err);
      setError("Erro inesperado ao fazer login");
      toast.error("Erro inesperado", {
        description: "Tente novamente",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔧 BOTÃO DE LIMPEZA MANUAL (DEBUG)
  const handleClearCache = async () => {
    try {
      setLoading(true);
      console.log("🧹 Limpando cache manualmente...");

      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Cache limpo com sucesso!", {
        description: "Agora tente fazer login novamente.",
      });

      // Recarregar a página
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
      toast.error("Erro ao limpar cache");
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

          {/* Botão de Limpeza (Debug) */}
          <Button
            type="button"
            variant="outline"
            onClick={handleClearCache}
            disabled={loading}
            className="w-full text-sm"
          >
            🗑️ Limpar Cache (Se travou)
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

        {/* Informação de Debug */}
        <div className="text-center text-xs text-muted-foreground mt-8 p-4 bg-muted/30 rounded-lg">
          <p>
            🔧 <strong>Problema de login?</strong>
          </p>
          <p>Use o botão Limpar Cache acima</p>
        </div>
      </div>
    </div>
  );
}
