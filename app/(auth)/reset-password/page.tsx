/**
 * PÁGINA DE CRIAÇÃO DE NOVA SENHA - CodeCraft Academy
 *
 * Página acessada via link do email de redefinição
 * Permite ao usuário criar uma nova senha
 */

"use client";

import { useState, useEffect } from "react"; // useEffect para side effects
import { useRouter, useSearchParams } from "next/navigation"; // Hooks para roteamento e parâmetros URL
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para acessar parâmetros da URL

  /**
   * VERIFICA SE HÁ UM TOKEN VÁLIDO NA URL
   * O Supabase adiciona automaticamente tokens de recuperação na URL
   */
  useEffect(() => {
    // Verifica se há parâmetros de recuperação na URL
    const token = searchParams.get("token"); // Pega token da URL
    const type = searchParams.get("type"); // Pega tipo da URL

    if (token && type === "recovery") {
      // Troca o código por uma sessão
      supabase.auth
        .verifyOtp({
          token_hash: token,
          type: "recovery",
        })
        .then(({ error }) => {
          if (error) {
            setError("Link inválido ou expirado"); // Token inválido
          }
        });
    }
  }, [searchParams]); // Executa quando searchParams mudar

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações
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
      // Atualiza a senha do usuário
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redireciona para login após 3 segundos
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch {
      setError("Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Nova Senha</h1>
          <p className="text-muted-foreground mt-2">
            Crie uma nova senha para sua conta
          </p>
        </div>

        {success ? ( // Se sucesso, mostra mensagem
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">Senha alterada!</span>
              </div>
              <p>Redirecionando para o login...</p>
            </div>
          </div>
        ) : (
          // Se não, mostra formulário
          <form onSubmit={handleResetPassword} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
