/**
 * PÁGINA DE REGISTRO - CodeCraft Academy
 *
 * Permite que novos usuários criem uma conta na plataforma
 * Inclui validação de senha e confirmação de email
 */

"use client"; // Componente cliente

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Hook para navegação programática
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmação de senha
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Hook para redirecionamento

  /**
   * FUNÇÃO DE REGISTRO
   * Valida os dados e cria nova conta
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // VALIDAÇÃO: Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return; // Para a execução se houver erro
    }

    try {
      // Tenta criar conta com Supabase Auth
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // URL para redirecionamento após confirmação de email
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // Redireciona para login com mensagem de sucesso
        router.push("/login?message=check-email");
      }
    } catch {
      setError("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Estrutura similar às outras páginas
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* CABEÇALHO */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-2xl gradient-text">CodeCraft</span>
          </Link>

          <h1 className="text-3xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground mt-2">
            Comece sua jornada em programação
          </p>
        </div>

        {/* FORMULÁRIO DE REGISTRO */}
        <form onSubmit={handleRegister} className="space-y-6">
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
              required
            />
          </div>

          {/* CAMPO SENHA */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} // Validação mínima do navegador
            />
          </div>

          {/* CAMPO CONFIRMAR SENHA */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Digite novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* BOTÃO DE REGISTRO */}
          <Button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        {/* LINK PARA LOGIN */}
        <div className="text-center">
          <Link href="/login" className="text-primary hover:underline">
            Já tem conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
