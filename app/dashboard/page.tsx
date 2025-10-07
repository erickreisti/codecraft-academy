"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";

// INTERFACES PARA TIPAGEM FORTE
interface Course {
  title: string;
  slug: string;
  image_url: string;
  duration_hours: number;
}

interface Enrollment {
  id: string;
  completed: boolean;
  progress: number;
  enrolled_at: string;
  completed_at?: string;
  courses: Course | null;
}

interface Profile {
  full_name?: string;
}

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 VERIFICAR SESSÃO NO CLIENTE
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession);

        if (currentSession) {
          // 🎯 BUSCAR DADOS DO USUÁRIO
          await fetchUserData(currentSession.user.id);
        }
      } catch (error) {
        console.error("💥 Erro ao verificar sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 🎯 LISTENER PARA MUDANÇAS DE AUTENTICAÇÃO
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session) {
        await fetchUserData(session.user.id);
      } else {
        setEnrollments([]);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 📊 BUSCAR DADOS DO USUÁRIO
  const fetchUserData = async (userId: string) => {
    try {
      // Buscar perfil
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(profileData);

      // Buscar matrículas
      const { data: enrollmentsData } = await supabase
        .from("enrollments")
        .select(
          `
          *,
          courses (
            title,
            slug,
            image_url,
            duration_hours
          )
        `
        )
        .eq("user_id", userId)
        .order("enrolled_at", { ascending: false });

      setEnrollments(enrollmentsData || []);
    } catch (error) {
      console.error("💥 Erro ao buscar dados:", error);
    }
  };

  // 🎯 CALCULAR ESTATÍSTICAS
  const totalCourses = enrollments?.length || 0;
  const completedCourses = enrollments?.filter((e) => e.completed).length || 0;
  const inProgressCourses =
    enrollments?.filter((e) => !e.completed && e.progress > 0).length || 0;
  const averageProgress = enrollments?.length
    ? Math.round(
        enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) /
          enrollments.length
      )
    : 0;

  // 🔧 Nome de exibição
  const displayName =
    profile?.full_name || session?.user?.email?.split("@")[0] || "Aluno";

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">⏳</div>
          <h2 className="text-2xl font-bold">Carregando...</h2>
          <p className="text-muted-foreground">Preparando seu dashboard</p>
        </div>
      </div>
    );
  }

  // 🔐 ACESSO NEGADO
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="text-6xl">🔐</div>
          <h2 className="text-2xl font-bold">Acesso não autorizado</h2>
          <p className="text-muted-foreground">
            Você precisa estar logado para acessar o dashboard.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full btn btn-primary">
              <Link href="/login">Fazer Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Voltar para Home</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Se você já fez login, tente recarregar a página.
          </p>
        </div>
      </div>
    );
  }

  // 🎉 DASHBOARD PRINCIPAL
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-30">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Bem-vindo, {displayName}! 👋
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* ✅ BOTÃO DO PERFIL ADICIONADO AQUI */}
              <Button asChild variant="outline" className="btn btn-secondary">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2"
                >
                  👤 Perfil
                </Link>
              </Button>

              <Button asChild className="btn btn-primary">
                <Link href="/courses">🚀 Explorar Cursos</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => supabase.auth.signOut()}
                className="text-sm"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* 🎯 CARDS DE ESTATÍSTICAS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="feature-card hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>📚</span> Total de Cursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {totalCourses}
              </div>
              <p className="text-sm text-muted-foreground">Matriculados</p>
            </CardContent>
          </Card>

          <Card className="feature-card hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>✅</span> Concluídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {completedCourses}
              </div>
              <p className="text-sm text-muted-foreground">
                Cursos finalizados
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🔄</span> Em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {inProgressCourses}
              </div>
              <p className="text-sm text-muted-foreground">
                Cursando ativamente
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card hover-lift">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>📈</span> Progresso Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {averageProgress}%
              </div>
              <p className="text-sm text-muted-foreground">
                Em todos os cursos
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 📚 MEUS CURSOS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">📖 Meus Cursos</h2>
            <Button variant="outline" asChild className="group">
              <Link
                href="/dashboard/courses"
                className="flex items-center gap-2"
              >
                Ver Todos
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </Button>
          </div>

          {enrollments && enrollments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.slice(0, 6).map((enrollment) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 border-dashed">
              <CardContent className="space-y-6">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-foreground">
                  Nenhum curso matriculado
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                  Explore nossos cursos e comece sua jornada em programação!
                </p>
                <Button asChild className="btn btn-primary mt-4 btn-lg">
                  <Link href="/courses" className="flex items-center gap-2">
                    🚀 Explorar Cursos
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}

// 🎴 COMPONENTE: CARD DE CURSO
interface CourseCardProps {
  enrollment: Enrollment;
}

function CourseCard({ enrollment }: CourseCardProps) {
  const course = enrollment.courses;

  return (
    <Card className="feature-card group hover-lift">
      <CardHeader className="pb-4">
        <div className="h-40 gradient-bg rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
          <span className="text-white text-4xl z-10">📚</span>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
        </div>

        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
          {course?.title || "Curso"}
        </CardTitle>

        <CardDescription className="line-clamp-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              enrollment.completed
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {enrollment.completed
              ? "✅ Concluído"
              : `🔄 ${enrollment.progress}%`}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!enrollment.completed && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progresso</span>
              <span className="font-medium">{enrollment.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${enrollment.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <Button asChild className="w-full btn btn-primary group/btn">
          <Link
            href={course?.slug ? `/courses/${course.slug}` : "/courses"}
            className="flex items-center justify-center gap-2"
          >
            {enrollment.completed ? (
              <>
                📝 Revisar Curso
                <span className="group-hover/btn:translate-x-1 transition-transform">
                  →
                </span>
              </>
            ) : (
              <>
                ▶️ Continuar
                <span className="group-hover/btn:translate-x-1 transition-transform">
                  →
                </span>
              </>
            )}
          </Link>
        </Button>

        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>
            📅 {new Date(enrollment.enrolled_at).toLocaleDateString("pt-BR")}
          </span>
          {enrollment.completed && enrollment.completed_at && (
            <span>
              🎉 {new Date(enrollment.completed_at).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
