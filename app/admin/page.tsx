// app/admin/page.tsx - VERSÃO MELHORADA
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Settings,
  Crown,
  User,
  ArrowRight,
  Shield,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
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

      // Buscar perfil completo para mostrar o full_name
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, role, created_at")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("❌ Erro ao buscar perfil:", profileError);
        router.push("/");
        return;
      }

      setProfile(profile);
      console.log("📋 Perfil carregado:", profile);

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

  // Cards de funcionalidades do admin
  const adminFeatures = [
    {
      title: "Gerenciar Cursos",
      description: "Crie, edite e publique cursos na plataforma",
      icon: <BookOpen className="h-7 w-7" />,
      href: "/admin/courses",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      buttonText: "Ver Cursos",
    },
    {
      title: "Gerenciar Blog",
      description: "Crie e edite posts do blog educacional",
      icon: <FileText className="h-7 w-7" />,
      href: "/admin/posts",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      buttonText: "Ver Posts",
    },
    {
      title: "Estatísticas",
      description: "Acompanhe métricas e desempenho da plataforma",
      icon: <BarChart3 className="h-7 w-7" />,
      href: "/admin/analytics",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      buttonText: "Ver Estatísticas",
    },
    {
      title: "Usuários",
      description: "Gerencie alunos, instrutores e administradores",
      icon: <Users className="h-7 w-7" />,
      href: "/admin/users",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      buttonText: "Ver Usuários",
    },
  ];

  // Stats rápidas (pode ser substituído por dados reais depois)
  const quickStats = [
    {
      label: "Cursos Ativos",
      value: "12",
      icon: <BookOpen className="h-5 w-5" />,
      color: "text-blue-600",
    },
    {
      label: "Posts Publicados",
      value: "24",
      icon: <FileText className="h-5 w-5" />,
      color: "text-green-600",
    },
    {
      label: "Alunos Ativos",
      value: "156",
      icon: <GraduationCap className="h-5 w-5" />,
      color: "text-purple-600",
    },
    {
      label: "Crescimento",
      value: "+28%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <Spinner size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              Verificando acesso administrativo...
            </h2>
            <p className="text-muted-foreground">Carregando suas credenciais</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto p-8">
          <div className="text-7xl mb-4">🚫</div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-red-600">Acesso Negado</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Você não tem permissões de administrador para acessar esta área.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <Button asChild className="w-full btn btn-primary btn-lg">
              <Link href="/" className="flex items-center gap-2 justify-center">
                ← Voltar para Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full btn-lg">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 justify-center"
              >
                <User className="h-4 w-4" />
                Meu Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-custom py-12">
        {/* HEADER DO PAINEL ADMIN */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <Crown className="h-6 w-6" />
            <span className="font-semibold">Painel Administrativo</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Bem-vindo,{" "}
            <span className="gradient-text">
              {profile?.full_name || user?.email}!
            </span>
          </h1>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Gerencie toda a plataforma CodeCraft Academy em um só lugar
            </p>

            {/* INFO DO ADMIN */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-2 rounded-lg">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Administrador</span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS RÁPIDAS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              className="text-center p-6 hover-lift transition-all duration-300"
            >
              <CardContent className="p-0 space-y-3">
                <div className={`flex justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* GRID DE FUNCIONALIDADES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminFeatures.map((feature, index) => (
            <Card
              key={index}
              className="hover-lift group border-2 transition-all duration-300 hover:border-primary/20"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-xl ${feature.bgColor} ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform mt-2" />
                </div>

                <CardTitle className="text-xl font-bold mt-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardHeader>

              <CardContent>
                <Button asChild className="w-full btn btn-primary group/btn">
                  <Link
                    href={feature.href}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>{feature.buttonText}</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 p-6 bg-muted/30 rounded-2xl border">
            <Button asChild variant="outline" className="btn-lg">
              <Link href="/dashboard" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Voltar ao Meu Dashboard
              </Link>
            </Button>

            <Button asChild className="btn-lg">
              <Link
                href="/admin/courses/new"
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Criar Novo Curso
              </Link>
            </Button>

            <Button asChild variant="outline" className="btn-lg">
              <Link href="/admin/posts/new" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Novo Post
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
