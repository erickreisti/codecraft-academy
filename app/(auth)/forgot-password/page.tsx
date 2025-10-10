// app/forgot-password/page.tsx - VERSÃO CORRIGIDA
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        setError(error.message);
        toast.error("Erro ao enviar email", {
          description: error.message,
        });
      } else {
        setSuccess(true);
        toast.success("Email enviado com sucesso!", {
          description: "Verifique sua caixa de entrada e pasta de spam.",
        });
      }
    } catch {
      setError("Erro ao solicitar redefinição de senha");
      toast.error("Erro inesperado");
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
            <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-3xl gradient-text">CodeCraft</span>
          </Link>

          <h1 className="text-3xl font-bold gradient-text">Redefinir Senha</h1>
          <p className="text-muted-foreground mt-2">
            Enviaremos um link para criar uma nova senha
          </p>
        </div>

        {/* CONDICIONAL: Mostra formulário OU mensagem de sucesso */}
        {!success ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* EXIBIÇÃO DE ERROS */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* EXPLICAÇÃO */}
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              <p>
                Digite seu email e enviaremos um link para redefinir sua senha.
                O link expira em 24 horas.
              </p>
            </div>

            {/* CAMPO EMAIL */}
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

            {/* BOTÃO DE ENVIO */}
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
                  Enviando...
                </div>
              ) : (
                "📧 Enviar Link de Redefinição"
              )}
            </Button>
          </form>
        ) : (
          // MENSAGEM DE SUCESSO
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">Email enviado!</span>
              </div>
              <p className="text-sm">
                Enviamos um link de redefinição para <strong>{email}</strong>.
                Verifique sua caixa de entrada e pasta de spam.
              </p>
            </div>

            {/* INSTRUÇÕES ADICIONAIS */}
            <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-semibold mb-2">📋 Próximos passos:</p>
              <ul className="space-y-1 text-left">
                <li>• Verifique seu email</li>
                <li>• Clique no link de redefinição</li>
                <li>• Crie uma nova senha</li>
                <li>• Faça login com a nova senha</li>
              </ul>
            </div>
          </div>
        )}

        {/* LINKS DE NAVEGAÇÃO */}
        <div className="text-center space-y-4">
          <Link
            href="/login"
            className="block text-primary hover:text-primary/80 font-medium transition-colors"
          >
            ← Voltar para o login
          </Link>

          {!success && (
            <Link
              href="/register"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Não tem conta? Cadastre-se
            </Link>
          )}
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
