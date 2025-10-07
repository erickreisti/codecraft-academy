// app/login/page.tsx - VERSÃO CORRIGIDA
"use client"; // Componente do lado do cliente

import { useState } from "react"; // Hook para estado
import Link from "next/link"; // Navegação
import { Button } from "@/components/ui/button"; // Componentes UI
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client"; // Cliente Supabase

export default function LoginPage() {
  // Estados do formulário
  const [email, setEmail] = useState(""); // Email do usuário
  const [password, setPassword] = useState(""); // Senha do usuário
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState(""); // Mensagens de erro

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne submit padrão
    setLoading(true); // Ativa carregamento
    setError(""); // Limpa erros

    try {
      // Tenta fazer login com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message); // Exibe erro de autenticação
      } else if (data?.user) {
        // Se login bem sucedido
        // Dar tempo para os cookies serem salvos
        setTimeout(() => {
          window.location.href = "/dashboard"; // Redireciona para dashboard
        }, 1000); // Espera 1 segundo
      }
    } catch (err) {
      console.error("💥 ERRO CATCH:", err); // Log de erro
      setError("Erro ao fazer login"); // Mensagem genérica
    } finally {
      setLoading(false); // Desativa carregamento
    }
  };

  return (
    // Estrutura similar à página de recuperação
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Cabeçalho com logo */}
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

        {/* Formulário de login */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && ( // Exibe erro se existir
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Campo email */}
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

          {/* Campo senha */}
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

          {/* Botão de login */}
          <Button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Links de navegação */}
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
