// app/reset-password/page.tsx - VERSÃO CORRIGIDA
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log("🔍 Verificando autenticação para reset de senha...");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          console.log("❌ Usuário não autenticado para reset de senha");
          setTokenValid(false);
          setError("Sessão expirada. Solicite um novo link de redefinição.");
        } else {
          console.log("✅ Usuário autenticado, pode redefinir senha");
          setTokenValid(true);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setTokenValid(false);
        setError("Erro ao verificar autenticação");
      }
    };

    checkAuthentication();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError("A senha deve conter letras maiúsculas, minúsculas e números");
      return;
    }

    try {
      console.log("🔄 Atualizando senha...");

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("❌ Erro ao atualizar senha:", error);
        setError(error.message);
        toast.error("Erro ao redefinir senha", {
          description: error.message,
        });
      } else {
        console.log("✅ Senha atualizada com sucesso!");
        setSuccess(true);
        toast.success("Senha redefinida com sucesso!", {
          description: "Redirecionando para o login...",
        });

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("💥 Erro inesperado:", err);
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
          <h1 className="text-2xl font-bold gradient-text">
            Link inválido ou expirado
          </h1>
          <p className="text-muted-foreground">
            {error || "Este link de redefinição é inválido ou expirou."}
          </p>
          <div className="space-y-3">
            <Button
              asChild
              className="w-full gradient-bg hover:opacity-90 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
            >
              <Link href="/forgot-password">Solicitar novo link</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Voltar para o login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Cabeçalho */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-3xl gradient-text">CodeCraft</span>
          </Link>

          <h1 className="text-3xl font-bold gradient-text">Criar Nova Senha</h1>
          <p className="text-muted-foreground mt-2">
            Digite sua nova senha abaixo
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
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Nova Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="border-border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-foreground font-medium"
              >
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="border-border focus:border-primary transition-colors"
              />
            </div>

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
                  Redefinindo...
                </div>
              ) : (
                "🔐 Redefinir Senha"
              )}
            </Button>
          </form>
        )}

        {/* Decoração visual */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
