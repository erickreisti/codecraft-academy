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
import { Spinner } from "@/components/ui/spinner";
import {
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  User,
  Rocket,
  ArrowRight,
  Calendar,
  Award,
} from "lucide-react";

// INTERFACES PARA TIPAGEM FORTE
interface Course {
  title: string;
  slug: string;
  image_url: string;
  duration_hours: number;
  category?: string;
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
  role?: string;
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
            duration_hours,
            category
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
        <div className="text-center space-y-6">
          <Spinner size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Carregando Dashboard</h2>
            <p className="text-muted-foreground text-lg">
              Preparando sua experiência de aprendizado
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🔐 ACESSO NEGADO
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto p-8">
          <div className="text-7xl mb-4">🔐</div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Acesso não autorizado</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Você precisa estar logado para acessar o dashboard.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <Button asChild className="w-full btn btn-primary btn-lg">
              <Link
                href="/login"
                className="flex items-center gap-2 justify-center"
              >
                <User className="h-5 w-5" />
                Fazer Login
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full btn-lg">
              <Link href="/" className="flex items-center gap-2 justify-center">
                ← Voltar para Home
              </Link>
            </Button>
          </div>
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
          <div className="flex h-20 items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Bem-vindo,{" "}
                <span className="font-semibold text-foreground">
                  {displayName}
                </span>
                ! 👋
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="btn btn-secondary">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3"
                >
                  <User className="h-4 w-4" />
                  Meu Perfil
                </Link>
              </Button>

              <Button asChild className="btn btn-primary">
                <Link href="/courses" className="flex items-center gap-3">
                  <Rocket className="h-4 w-4" />
                  Explorar Cursos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-12">
        {/* 🎯 CARDS DE ESTATÍSTICAS */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Sua Jornada de Aprendizado
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Acompanhe seu progresso e continue evoluindo na programação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Total de Cursos"
              value={totalCourses}
              description="Matriculados"
              color="text-blue-600"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />

            <StatCard
              icon={<CheckCircle className="h-8 w-8" />}
              title="Concluídos"
              value={completedCourses}
              description="Cursos finalizados"
              color="text-green-600"
              bgColor="bg-green-50 dark:bg-green-900/20"
            />

            <StatCard
              icon={<Clock className="h-8 w-8" />}
              title="Em Andamento"
              value={inProgressCourses}
              description="Cursando ativamente"
              color="text-orange-600"
              bgColor="bg-orange-50 dark:bg-orange-900/20"
            />

            <StatCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Progresso Médio"
              value={`${averageProgress}%`}
              description="Em todos os cursos"
              color="text-purple-600"
              bgColor="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>
        </section>

        {/* 📚 MEUS CURSOS */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Meus Cursos</h2>
              <p className="text-muted-foreground text-lg">
                Continue de onde parou ou explore novos conteúdos
              </p>
            </div>
            <Button variant="outline" asChild className="group btn-lg">
              <Link
                href="/dashboard/courses"
                className="flex items-center gap-3"
              >
                Ver Todos os Cursos
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {enrollments && enrollments.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.slice(0, 6).map((enrollment) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-20 border-dashed">
              <CardContent className="space-y-8">
                <div className="text-8xl mb-6">📚</div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-foreground">
                    Nenhum curso matriculado
                  </h3>
                  <p className="text-muted-foreground text-xl max-w-md mx-auto leading-relaxed">
                    Sua jornada em programação está prestes a começar!
                  </p>
                </div>
                <Button asChild className="btn btn-primary btn-lg mt-6">
                  <Link href="/courses" className="flex items-center gap-3">
                    <Rocket className="h-5 w-5" />
                    Explorar Cursos Disponíveis
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

// 🎴 COMPONENTE: CARD DE ESTATÍSTICA
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
  color: string;
  bgColor: string;
}

function StatCard({
  icon,
  title,
  value,
  description,
  color,
  bgColor,
}: StatCardProps) {
  return (
    <Card className="feature-card group hover-lift p-6">
      <CardContent className="p-0 space-y-6">
        <div
          className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">{value}</div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground text-lg">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 🎴 COMPONENTE: CARD DE CURSO
interface CourseCardProps {
  enrollment: Enrollment;
}

function CourseCard({ enrollment }: CourseCardProps) {
  const course = enrollment.courses;

  return (
    <Card className="feature-card group hover-lift overflow-hidden">
      <CardHeader className="pb-6">
        <div className="h-48 gradient-bg rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
          <span className="text-white text-5xl z-10">📚</span>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>

          {/* Badge de status */}
          <div className="absolute top-4 right-4 z-20">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                enrollment.completed
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}
            >
              {enrollment.completed ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Concluído
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  {enrollment.progress}% completo
                </>
              )}
            </div>
          </div>
        </div>

        <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
          {course?.title || "Curso"}
        </CardTitle>

        {course?.category && (
          <CardDescription className="flex items-center gap-2 text-sm">
            <span className="bg-muted px-2 py-1 rounded-md">
              {course.category}
            </span>
            <span>•</span>
            <span>{course.duration_hours}h</span>
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {!enrollment.completed && enrollment.progress > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Seu progresso</span>
              <span className="font-semibold text-foreground">
                {enrollment.progress}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${enrollment.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <Button asChild className="w-full btn btn-primary group/btn py-3">
          <Link
            href={course?.slug ? `/courses/${course.slug}` : "/courses"}
            className="flex items-center justify-center gap-3 text-base"
          >
            {enrollment.completed ? (
              <>
                <Award className="h-5 w-5" />
                Revisar Curso
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            ) : enrollment.progress > 0 ? (
              <>
                <Play className="h-5 w-5" />
                Continuar
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                <BookOpen className="h-5 w-5" />
                Começar Agora
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </Link>
        </Button>

        <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Inscrito em{" "}
              {new Date(enrollment.enrolled_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
          {enrollment.completed && enrollment.completed_at && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>
                {new Date(enrollment.completed_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Ícone Play para o botão
function Play({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
