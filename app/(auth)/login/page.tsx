// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // Normaliza email
        password,
      });

      if (error) {
        setError(error.message);
        toast.error("Erro no login", {
          description: "Verifique suas credenciais e tente novamente.",
        });
        return;
      }

      if (data?.user) {
        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando para sua área...",
        });

        // Redirecionamento seguro com fallback
        const urlParams = new URLSearchParams(window.location.search);
        const redirectedFrom = urlParams.get("redirectedFrom");
        const redirectTo = redirectedFrom || "/dashboard";

        // Timeout para melhor UX
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1500);
      }
    } catch (err) {
      setError("Erro inesperado ao fazer login");
      toast.error("Erro de conexão", {
        description: "Verifique sua internet e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
        {/* Branding Section - Otimizada para SEO */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-16 w-24 h-24 bg-white rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 mb-8 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg"
              aria-label="CodeCraft Academy - Voltar para home"
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-white">CodeCraft</span>
            </Link>

            <div className="space-y-4 mt-16">
              <h1 className="text-4xl font-bold leading-tight">
                Bem-vindo de volta
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                Continue sua jornada de aprendizado e alcance novos patamares na
                sua carreira em tecnologia.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="relative z-10">
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    aria-hidden="true"
                  ></div>
                  <span className="text-sm">+5.000 alunos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 bg-yellow-400 rounded-full"
                    aria-hidden="true"
                  ></div>
                  <span className="text-sm">98% de satisfação</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full"
                    aria-hidden="true"
                  ></div>
                  <span className="text-sm">Cursos atualizados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section - Acessibilidade melhorada */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-8">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center space-x-3 mb-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeCraft
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">
                Entre na sua conta
              </h1>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center">
              <h1 className="text-3xl font-bold text-foreground">
                Entre na sua conta
              </h1>
              <p className="text-muted-foreground mt-2">
                Acesse sua área de aluno e continue aprendendo
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6" noValidate>
              {error && (
                <div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center gap-3"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 dark:text-red-300 text-sm">
                      !
                    </span>
                  </div>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
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
                      aria-describedby="email-help"
                      autoComplete="email"
                    />
                  </div>
                  <p id="email-help" className="sr-only">
                    Digite seu endereço de email cadastrado
                  </p>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="text-foreground font-medium text-sm"
                    >
                      Senha
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 pr-10 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors h-12 rounded-xl bg-white dark:bg-gray-800"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 shadow-lg hover:shadow-xl transition-all duration-200 border-0 rounded-xl text-base group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !email || !password}
                aria-busy={loading}
              >
                <div
                  className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"
                  aria-hidden="true"
                ></div>
                <div className="relative flex items-center gap-2 justify-center">
                  {loading ? (
                    <>
                      <Spinner
                        size="sm"
                        className="border-white border-t-transparent"
                      />
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Entrar na Plataforma</span>
                    </>
                  )}
                </div>
              </Button>
            </form>

            {/* Registration Link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors hover:underline"
                >
                  Cadastre-se gratuitamente
                </Link>
              </p>
            </div>

            {/* Security Notice */}
            <div className="text-center pt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Sua segurança é nossa prioridade. Todos os dados são
                criptografados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
