// app/reset-password/page.tsx - NOVO ARQUIVO
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Verificar se há um token válido na URL
  useEffect(() => {
    const checkToken = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (token && type === "recovery") {
        setTokenValid(true);
      } else {
        setError("Link inválido ou expirado");
        toast.error("Link inválido");
      }
    };

    checkToken();
  }, [searchParams]);

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
      // Atualizar a senha
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        toast.error("Erro ao redefinir senha", {
          description: error.message,
        });
      } else {
        setSuccess(true);
        toast.success("Senha redefinida com sucesso!", {
          description: "Redirecionando para o login...",
        });

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch {
      setError("Erro ao redefinir senha");
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid && !success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">❌</div>
          <h1 className="text-2xl font-bold">Link inválido</h1>
          <p className="text-muted-foreground">
            Este link de redefinição é inválido ou expirou.
          </p>
          <Button asChild className="btn btn-primary">
            <Link href="/forgot-password">Solicitar novo link</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Nova Senha</h1>
          <p className="text-muted-foreground mt-2">
            Crie uma nova senha para sua conta
          </p>
        </div>

        {success ? (
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
                disabled={loading}
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
                  Redefinindo...
                </div>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
