// app/reset-password/page.tsx - DESIGN PREMIUM CORRIGIDO
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
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setTokenValid(false);
          setError("Sessão expirada. Solicite um novo link de redefinição.");
        } else {
          setTokenValid(true);
        }
      } catch (error) {
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

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError("Erro ao redefinir senha");
      toast.error("Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid && !success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            Link Expirado
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "Este link de redefinição é inválido ou expirou."}
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link
                href="/forgot-password"
                className="flex items-center gap-2 justify-center"
              >
                Solicitar Novo Link
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link
                href="/login"
                className="flex items-center gap-2 justify-center"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            Senha Alterada!
          </h1>
          <p className="text-muted-foreground mb-2">
            Sua senha foi redefinida com sucesso.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Redirecionando para o login...
          </p>

          <div className="w-12 h-12 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    );
  }

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
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Nova Senha
          </h1>
          <p className="text-muted-foreground">
            Crie uma nova senha para sua conta
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-5">
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

          {/* Password Requirements */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl p-4">
            <p className="text-sm font-medium mb-2">Requisitos da senha:</p>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    password.length >= 6 ? "bg-green-500" : "bg-blue-300"
                  }`}
                ></div>
                Mínimo 6 caracteres
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    /(?=.*[a-z])/.test(password)
                      ? "bg-green-500"
                      : "bg-blue-300"
                  }`}
                ></div>
                Pelo menos uma letra minúscula
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    /(?=.*[A-Z])/.test(password)
                      ? "bg-green-500"
                      : "bg-blue-300"
                  }`}
                ></div>
                Pelo menos uma letra maiúscula
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    /(?=.*\d)/.test(password) ? "bg-green-500" : "bg-blue-300"
                  }`}
                ></div>
                Pelo menos um número
              </li>
            </ul>
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <Label
              htmlFor="password"
              className="text-foreground font-medium text-sm"
            >
              Nova Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="pl-10 pr-10 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors h-12 rounded-xl bg-white dark:bg-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-3">
            <Label
              htmlFor="confirmPassword"
              className="text-foreground font-medium text-sm"
            >
              Confirmar Nova Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Digite novamente a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="pl-10 pr-10 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors h-12 rounded-xl bg-white dark:bg-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
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
                  <span>Redefinindo...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Redefinir Senha</span>
                </>
              )}
            </div>
          </Button>
        </form>

        {/* Navigation */}
        <div className="text-center space-y-4 pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Voltar para o login
          </Link>
        </div>

        {/* Security Note */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Sua senha é criptografada e segura
          </p>
        </div>
      </div>
    </div>
  );
}
