// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.log("❌ Não logado:", error);
        router.push("/login");
        return;
      }

      setUser(user);
      console.log("👤 Usuário logado:", user.email);

      // Verificar se é admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("❌ Erro ao buscar perfil:", profileError);
        router.push("/");
        return;
      }

      const userIsAdmin = profile?.role === "admin";
      setIsAdmin(userIsAdmin);

      if (!userIsAdmin) {
        console.log("❌ Usuário não é admin");
        router.push("/");
        return;
      }

      console.log("✅ Acesso admin concedido");
    } catch (error) {
      console.error("💥 Erro na verificação:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p>Verificando acesso administrativo...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="mt-2">
            Você não tem permissão para acessar esta página.
          </p>
          <Button asChild className="mt-4">
            <a href="/">Voltar para Home</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
          <p className="text-muted-foreground mb-8">
            Bem-vindo, {user?.email}!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild className="btn btn-primary">
              <Link href="/admin/courses">Gerenciar Cursos</Link>
            </Button>
            <Button asChild className="btn btn-secondary">
              <Link href="/admin/posts">Gerenciar Posts</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
