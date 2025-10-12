// app/admin/page.tsx - VERSÃO PROFISSIONAL E FUNCIONAL
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
  Plus,
  Database,
  ShieldCheck,
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

  // Cards de funcionalidades principais
  const coreFeatures = [
    {
      title: "Cursos",
      description: "Gerenciar todos os cursos da plataforma",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/admin/courses",
      count: "12",
      color: "blue",
      action: "Gerenciar",
    },
    {
      title: "Conteúdo",
      description: "Posts do blog e conteúdo educacional",
      icon: <FileText className="h-6 w-6" />,
      href: "/admin/posts",
      count: "24",
      color: "green",
      action: "Gerenciar",
    },
    {
      title: "Usuários",
      description: "Alunos, instrutores e administradores",
      icon: <Users className="h-6 w-6" />,
      href: "/admin/users",
      count: "156",
      color: "purple",
      action: "Gerenciar",
    },
    {
      title: "Análises",
      description: "Métricas e relatórios da plataforma",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/admin/analytics",
      count: "+28%",
      color: "orange",
      action: "Visualizar",
    },
  ];

  // Ações rápidas
  const quickActions = [
    {
      title: "Novo Curso",
      description: "Criar um novo curso",
      icon: <Plus className="h-5 w-5" />,
      href: "/admin/courses/new",
      color: "blue",
    },
    {
      title: "Novo Post",
      description: "Publicar no blog",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/posts/new",
      color: "green",
    },
    {
      title: "Configurações",
      description: "Configurações do sistema",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      color: "gray",
    },
  ];

  // Status do sistema
  const systemStatus = [
    { label: "API", status: "online", color: "bg-green-500" },
    { label: "Database", status: "online", color: "bg-green-500" },
    { label: "Storage", status: "online", color: "bg-green-500" },
    { label: "Cache", status: "stable", color: "bg-blue-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <Spinner size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Verificando acesso...
            </h2>
            <p className="text-muted-foreground">
              Carregando credenciais de administrador
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Acesso Restrito
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Você não possui permissões de administrador para acessar esta
              área.
            </p>
          </div>
          <div className="space-y-3 pt-4">
            <Button asChild className="w-full">
              <Link href="/">Voltar para Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Ir para Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-custom py-8">
        {/* HEADER COMPACTO */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Painel Admin
                </h1>
                <p className="text-sm text-muted-foreground">
                  {profile?.full_name || user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* STATUS DO SISTEMA */}
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                {systemStatus.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-xs">{item.label}</span>
                    {index < systemStatus.length - 1 && (
                      <span className="text-muted-foreground/50">•</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CONTEÚDO PRINCIPAL */}
          <div className="lg:col-span-2 space-y-8">
            {/* CARDS PRINCIPAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coreFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="group border hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${
                          feature.color === "blue"
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : feature.color === "green"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600"
                            : feature.color === "purple"
                            ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                            : "bg-orange-50 dark:bg-orange-900/20 text-orange-600"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {feature.count}
                      </div>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {feature.description}
                    </p>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full text-sm"
                    >
                      <Link
                        href={feature.href}
                        className="flex items-center justify-center gap-2"
                      >
                        {feature.action}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AÇÕES RÁPIDAS */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      asChild
                      variant="outline"
                      className="h-auto py-4 justify-start"
                    >
                      <Link
                        href={action.href}
                        className="flex items-center gap-3 text-left"
                      >
                        <div
                          className={`p-2 rounded ${
                            action.color === "blue"
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                              : action.color === "green"
                              ? "bg-green-50 dark:bg-green-900/20 text-green-600"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {action.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {action.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* INFO DO USUÁRIO */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {profile?.full_name || "Administrador"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Função</span>
                    <span className="font-medium">Administrador</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-green-600 font-medium">Ativo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ATIVIDADE RECENTE */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div>Novo curso publicado</div>
                      <div className="text-xs text-muted-foreground">
                        há 2 horas
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div>Usuário registrado</div>
                      <div className="text-xs text-muted-foreground">
                        há 4 horas
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <div>Post atualizado</div>
                      <div className="text-xs text-muted-foreground">
                        há 1 dia
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-sm" asChild>
                  <Link href="/admin/activity">Ver toda atividade</Link>
                </Button>
              </CardContent>
            </Card>

            {/* LINKS ÚTEIS */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Links Úteis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  asChild
                >
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard Pessoal
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  asChild
                >
                  <Link href="/">
                    <Database className="h-4 w-4 mr-2" />
                    Site Principal
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  asChild
                >
                  <Link href="/admin/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
