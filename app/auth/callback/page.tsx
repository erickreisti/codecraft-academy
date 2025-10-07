// app/auth/callback/page.tsx - VERIFICAR SE ESTÁ ASSIM
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log("🔄 Processando callback...");

        // O token já foi processado automaticamente pelo Supabase do hash
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const next = searchParams.get("next") || "/dashboard";

        if (session) {
          console.log("✅ Autenticado! Redirecionando para:", next);
          toast.success("Autenticado com sucesso!");
          router.push(next);
        } else {
          console.log("❌ Falha na autenticação");
          toast.error("Falha na autenticação");
          router.push("/login");
        }
      } catch (error) {
        console.error("💥 Erro no callback:", error);
        toast.error("Erro inesperado");
        router.push("/login");
      }
    };

    processCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-spin">🔄</div>
        <h2 className="text-xl font-bold">Processando...</h2>
        <p className="text-muted-foreground">Aguarde um momento</p>
      </div>
    </div>
  );
}
