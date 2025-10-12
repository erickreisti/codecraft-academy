// app/forgot-password/page.tsx - DESIGN PREMIUM
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Mail, ArrowLeft, Shield, CheckCircle2, Sparkles } from "lucide-react";

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
          description: "Verifique sua caixa de entrada.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodeCraft
            </span>
          </Link>

          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Redefinir Senha
          </h1>
          <p className="text-muted-foreground">
            Enviaremos um link seguro para criar uma nova senha
          </p>
        </div>

        {/* Content */}
        {!success ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center gap-3">
                <div className="w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-300 text-sm">
                    !
                  </span>
                </div>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Information Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-300 text-xs">
                    i
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium mb-1">Como funciona:</p>
                  <p>
                    Digite seu email e enviaremos um link de redefinição. O link
                    é válido por 24 horas.
                  </p>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-foreground font-medium text-sm"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors h-12 rounded-xl bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 shadow-lg hover:shadow-xl transition-all duration-200 border-0 rounded-xl text-base group relative overflow-hidden"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-2 justify-center">
                {loading ? (
                  <>
                    <Spinner
                      size="sm"
                      className="border-white border-t-transparent"
                    />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    <span>Enviar Link de Redefinição</span>
                  </>
                )}
              </div>
            </Button>
          </form>
        ) : (
          // Success State
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">
                Email enviado!
              </h3>
              <p className="text-muted-foreground">
                Enviamos um link de redefinição para{" "}
                <strong className="text-foreground">{email}</strong>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-sm">
              <p className="font-medium text-foreground mb-3">
                📋 Próximos passos:
              </p>
              <div className="space-y-2 text-left text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Verifique sua caixa de entrada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Clique no link de redefinição</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Crie sua nova senha</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Faça login com a nova senha</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              variant="outline"
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              Enviar outro email
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="text-center space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Voltar para o login
          </Link>

          {!success && (
            <div className="text-sm">
              <Link
                href="/register"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Não tem conta?{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Cadastre-se
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Segurança e privacidade garantidas
          </p>
        </div>
      </div>
    </div>
  );
}
