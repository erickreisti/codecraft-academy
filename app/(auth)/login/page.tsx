/**
 * PÁGINA DE LOGIN - CodeCraft Academy
 *
 * Permite que usuários façam login na plataforma
 * usando email e senha com Supabase Auth
 */

"use client"; // Necessário porque usa hooks e estado

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  // Estados para controlar o formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading durante o login
  const [error, setError] = useState(""); // Mensagens de erro
  const router = useRouter(); // Hook para navegação programática

  /**
   * FUNÇÃO DE LOGIN
   * Executada quando o formulário é submetido
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne comportamento padrão do formulário
    setLoading(true); // Ativa estado de loading
    setError(""); // Limpa erros anteriores

    try {
      // Tenta fazer login com Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Se houver erro, mostra para o usuário
      if (error) {
        setError(error.message);
      } else {
        // Se login for bem-sucedido, redireciona para dashboard
        router.push("/dashboard");
        router.refresh(); // Força atualização do layout
      }
    } catch {
      // Erro genérico em caso de falha na requisição
      setError("Erro ao fazer login");
    } finally {
      // Desativa loading independente do resultado
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* CABEÇALHO DA PÁGINA */}
        <div className="text-center">
          {/* Logo clicável para voltar à home */}
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-2xl gradient-text">CodeCraft</span>
          </Link>

          {/* Título e descrição */}
          <h1 className="text-3xl font-bold">Entre na sua conta</h1>
          <p className="text-muted-foreground mt-2">Acesse sua área de aluno</p>
        </div>

        {/* FORMULÁRIO DE LOGIN */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* EXIBIÇÃO DE ERROS */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* CAMPO EMAIL */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // Campo obrigatório
            />
          </div>

          {/* CAMPO SENHA */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // Campo obrigatório
            />
          </div>

          {/* BOTÃO DE SUBMIT */}
          <Button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading} // Desabilita durante loading
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* LINKS ADICIONAIS */}
        <div className="text-center space-y-4">
          {/* Link para cadastro */}
          <Link href="/register" className="block text-primary hover:underline">
            Não tem conta? Cadastre-se
          </Link>
          {/* Link para recuperação de senha */}
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
