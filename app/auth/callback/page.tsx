// app/auth/callback/page.tsx - VERSÃO CORRIGIDA COM SUSPENSE
"use client";

export const dynamic = "force-dynamic";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

// Componente que usa useSearchParams
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // O token já foi processado automaticamente pelo Supabase do hash
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const next = searchParams.get("next") || "/dashboard";

        if (session) {
          toast.success("Autenticado com sucesso!");
          router.push(next);
        } else {
          toast.error("Falha na autenticação");
          router.push("/login");
        }
      } catch (error) {
        toast.error("Erro inesperado");
        router.push("/login");
      }
    };

    processCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Spinner azul centralizado */}
          <Spinner size="lg" className="border-blue-600 border-t-transparent" />

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              Processando autenticação
            </h2>
            <p className="text-muted-foreground text-sm">
              Aguarde enquanto validamos suas credenciais...
            </p>
          </div>

          {/* Indicador de progresso adicional */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component
function AuthCallbackLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Spinner size="lg" className="border-blue-600 border-t-transparent" />
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              Carregando...
            </h2>
            <p className="text-muted-foreground text-sm">
              Preparando autenticação...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal com Suspense
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackLoading />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
