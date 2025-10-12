// app/login/page.tsx - DESIGN PREMIUM MELHORADO
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
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error("Erro no login", {
          description: error.message,
        });
        return;
      }

      if (data?.user) {
        toast.success("Login realizado com sucesso!", {
          description: "Redirecionando...",
        });

        const urlParams = new URLSearchParams(window.location.search);
        const redirectedFrom = urlParams.get("redirectedFrom");
        const redirectTo = redirectedFrom || "/dashboard";

        setTimeout(() => {
          window.location.href = redirectTo;
        }, 1000);
      }
    } catch {
      setError("Erro inesperado ao fazer login");
      toast.error("Erro inesperado", {
        description: "Tente novamente",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
        {/* Lado Esquerdo - Ilustração/Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
          {/* Decoração de fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-16 w-24 h-24 bg-white rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-white">CodeCraft</span>
            </Link>

            <div className="space-y-4 mt-16">
              <h2 className="text-4xl font-bold leading-tight">
                Bem-vindo de volta
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Continue sua jornada de aprendizado e alcance novos patamares na
                sua carreira em tecnologia.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">+5.000 alunos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">98% de satisfação</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Cursos atualizados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-8">
            {/* Header Mobile */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeCraft
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-foreground mt-4">
                Entre na sua conta
              </h1>
            </div>

            {/* Header Desktop */}
            <div className="hidden lg:block text-center">
              <h1 className="text-3xl font-bold text-foreground">
                Entre na sua conta
              </h1>
              <p className="text-muted-foreground mt-2">
                Acesse sua área de aluno e continue aprendendo
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-6">
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

              <div className="space-y-4">
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
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-foreground font-medium text-sm"
                  >
                    Senha
                  </Label>
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
              </div>

              {/* Botão de Login */}
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

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>

            {/* Links de Navegação */}
            <div className="text-center space-y-4">
              <div className="space-y-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors group"
                >
                  <span>Não tem uma conta?</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    Cadastre-se gratuitamente
                  </span>
                </Link>
              </div>

              <div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <span>Esqueceu sua senha?</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    Recuperar acesso
                  </span>
                </Link>
              </div>
            </div>

            {/* Informações de segurança */}
            <div className="text-center pt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-muted-foreground">
                🔒 Sua segurança é nossa prioridade. Todos os dados são
                criptografados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
