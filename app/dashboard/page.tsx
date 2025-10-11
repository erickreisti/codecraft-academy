// app/dashboard/page.tsx - VERSÃO CORRIGIDA COM CONSULTA FUNCIONAL

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
  Settings,
  Star,
  Crown,
  Play,
} from "lucide-react";

// INTERFACES
interface Course {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
  duration_hours?: number;
  category?: string;
  level?: string;
  description?: string;
  short_description?: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  completed: boolean;
  progress: number;
  enrolled_at: string;
  completed_at?: string;
  course?: Course;
}

interface Profile {
  full_name?: string;
  avatar_url?: string;
  role?: string;
}

export default function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 BUSCAR DADOS DO USUÁRIO - VERSÃO CORRIGIDA
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession);

        if (currentSession) {
          // Buscar perfil com avatar
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, role")
            .eq("id", currentSession.user.id)
            .single();

          setProfile(profileData);

          // 🔥 CONSULTA CORRIGIDA - Buscar matrículas e cursos separadamente
          const { data: enrollmentsData, error: enrollmentsError } =
            await supabase
              .from("enrollments")
              .select(
                "id, course_id, completed, progress, enrolled_at, completed_at"
              )
              .eq("user_id", currentSession.user.id)
              .order("enrolled_at", { ascending: false });

          if (enrollmentsError) {
            console.error("❌ Erro ao buscar matrículas:", enrollmentsError);
            return;
          }

          console.log("📚 Matrículas encontradas:", enrollmentsData);

          // Se houver matrículas, buscar os cursos correspondentes
          if (enrollmentsData && enrollmentsData.length > 0) {
            const courseIds = enrollmentsData.map((e) => e.course_id);

            console.log("🎯 IDs dos cursos:", courseIds);

            const { data: coursesData, error: coursesError } = await supabase
              .from("courses")
              .select("*")
              .in("id", courseIds);

            if (coursesError) {
              console.error("❌ Erro ao buscar cursos:", coursesError);
              // Se der erro nos cursos, ainda mostra as matrículas sem detalhes dos cursos
              setEnrollments(
                enrollmentsData.map((enrollment) => ({
                  ...enrollment,
                  course: undefined,
                }))
              );
            } else {
              console.log("✅ Cursos encontrados:", coursesData);

              // Combinar matrículas com cursos
              const enrichedEnrollments = enrollmentsData.map((enrollment) => {
                const course = coursesData?.find(
                  (c) => c.id === enrollment.course_id
                );
                return {
                  ...enrollment,
                  course: course || undefined,
                };
              });

              setEnrollments(enrichedEnrollments);
            }
          } else {
            setEnrollments([]);
          }
        }
      } catch (error) {
        console.error("💥 Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Listener para mudanças de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session) {
        await fetchUserData();
      } else {
        setEnrollments([]);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // 👤 DADOS DO USUÁRIO
  const displayName =
    profile?.full_name || session?.user?.email?.split("@")[0] || "Aluno";
  const memberSince = session ? new Date(session.user.created_at) : new Date();
  const now = new Date();
  const monthsAsMember = Math.floor(
    (now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <Spinner size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground dark:text-white">
              Carregando Dashboard
            </h2>
            <p className="text-muted-foreground text-lg dark:text-gray-300">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto p-8">
          <div className="text-7xl mb-4">🔐</div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground dark:text-white">
              Acesso não autorizado
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed dark:text-gray-300">
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
            <Button
              asChild
              variant="outline"
              className="w-full btn-lg dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* HEADER DESTACADO */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white shadow-2xl dark:from-gray-800 dark:via-purple-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-8 lg:py-12">
            {/* INFORMAÇÕES DO USUÁRIO */}
            <div className="flex items-start lg:items-center gap-6 mb-6 lg:mb-0">
              {/* AVATAR */}
              <div className="relative group">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 shadow-2xl">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl lg:text-3xl font-bold text-white">
                        {displayName[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* BADGE ONLINE */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-4 border-white dark:border-gray-800 rounded-full"></div>
              </div>

              {/* INFORMAÇÕES DE TEXTO */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl lg:text-4xl font-bold tracking-tight">
                    Olá, {displayName}! 👋
                  </h1>

                  {/* BADGE DE DESTAQUE */}
                  {profile?.role === "admin" && (
                    <div className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                      <Crown className="h-3 w-3" />
                      ADMIN
                    </div>
                  )}
                  {profile?.role === "instructor" && (
                    <div className="inline-flex items-center gap-1 bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold">
                      <Star className="h-3 w-3" />
                      INSTRUTOR
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-blue-100 dark:text-blue-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm lg:text-base">
                      Membro há {monthsAsMember}{" "}
                      {monthsAsMember === 1 ? "mês" : "meses"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm lg:text-base">
                      {totalCourses} {totalCourses === 1 ? "curso" : "cursos"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm lg:text-base">
                      {completedCourses} concluídos
                    </span>
                  </div>
                </div>

                {/* MENSAGEM MOTIVACIONAL */}
                <p className="text-blue-100 dark:text-blue-200 text-sm lg:text-base max-w-2xl">
                  {completedCourses > 0
                    ? "🎉 Continue assim! Seu progresso está incrível!"
                    : totalCourses > 0
                    ? "🚀 Sua jornada de aprendizado está apenas começando!"
                    : "🌟 Prepare-se para transformar sua carreira!"}
                </p>
              </div>
            </div>

            {/* AÇÕES RÁPIDAS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                asChild
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white btn-lg transition-all duration-300 hover:scale-105 dark:bg-white/10 dark:border-white/20"
              >
                <Link href="/courses" className="flex items-center gap-3">
                  <Rocket className="h-5 w-5" />
                  Explorar Cursos
                </Link>
              </Button>

              <Button
                variant="outline"
                className="bg-transparent hover:bg-white/10 border-white text-white btn-lg transition-all duration-300 hover:scale-105 dark:border-white/30 dark:hover:bg-white/20"
                asChild
              >
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3"
                >
                  <User className="h-5 w-5" />
                  Meu Perfil
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ONDA DECORATIVA */}
        <div className="w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 text-white fill-current dark:text-gray-800"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container-custom py-12 -mt-8 relative z-10">
        {/* 🎯 CARDS DE ESTATÍSTICAS */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-foreground dark:text-white">
              Seu Progresso
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed dark:text-gray-300">
              Acompanhe sua evolução e conquistas na plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Total de Cursos"
              value={totalCourses}
              description="Matriculados"
              color="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
              gradient="from-blue-500 to-blue-600"
            />

            <StatCard
              icon={<CheckCircle className="h-8 w-8" />}
              title="Concluídos"
              value={completedCourses}
              description="Cursos finalizados"
              color="text-green-600 dark:text-green-400"
              bgColor="bg-green-50 dark:bg-green-900/20"
              gradient="from-green-500 to-green-600"
            />

            <StatCard
              icon={<Clock className="h-8 w-8" />}
              title="Em Andamento"
              value={inProgressCourses}
              description="Cursando ativamente"
              color="text-orange-600 dark:text-orange-400"
              bgColor="bg-orange-50 dark:bg-orange-900/20"
              gradient="from-orange-500 to-orange-600"
            />

            <StatCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Progresso Médio"
              value={`${averageProgress}%`}
              description="Em todos os cursos"
              color="text-purple-600 dark:text-purple-400"
              bgColor="bg-purple-50 dark:bg-purple-900/20"
              gradient="from-purple-500 to-purple-600"
            />
          </div>
        </section>

        {/* 📚 MEUS CURSOS */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">
                Meus Cursos
              </h2>
              <p className="text-muted-foreground text-lg dark:text-gray-300">
                Continue de onde parou ou explore novos conteúdos
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="group btn-lg dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
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
            <Card className="text-center py-20 border-dashed bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 dark:border-gray-700">
              <CardContent className="space-y-8">
                <div className="text-8xl mb-6">📚</div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-foreground dark:text-white">
                    Nenhum curso matriculado
                  </h3>
                  <p className="text-muted-foreground text-xl max-w-md mx-auto leading-relaxed dark:text-gray-300">
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
  gradient: string;
}

function StatCard({
  icon,
  title,
  value,
  description,
  color,
  bgColor,
  gradient,
}: StatCardProps) {
  return (
    <Card className="feature-card group hover-lift p-6 border-0 shadow-lg bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 dark:border-gray-700">
      <CardContent className="p-0 space-y-6">
        <div className="flex items-center justify-between">
          <div
            className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center ${color}`}
          >
            {icon}
          </div>
          <div
            className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white text-xl font-bold`}
          >
            {value}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-lg dark:text-white">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm dark:text-gray-300">
            {description}
          </p>
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
  const course = enrollment.course;

  console.log("🎨 Renderizando card do curso:", course);

  return (
    <Card className="feature-card group hover-lift overflow-hidden bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 dark:border-gray-700">
      <CardHeader className="pb-6">
        <div className="h-48 gradient-bg rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
          {course?.image_url ? (
            <img
              src={course.image_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-5xl z-10">📚</span>
          )}
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

        <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem] dark:text-white">
          {course?.title || "Curso em Andamento"}
        </CardTitle>

        <CardDescription className="flex items-center gap-2 text-sm dark:text-gray-300">
          {course?.category && (
            <>
              <span className="bg-muted px-2 py-1 rounded-md dark:bg-gray-700">
                {course.category}
              </span>
              <span>•</span>
            </>
          )}
          <span>{course?.duration_hours || 8}h</span>
          {course?.level && (
            <>
              <span>•</span>
              <span className="capitalize">{course.level}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!enrollment.completed && enrollment.progress > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground dark:text-gray-300">
              <span>Seu progresso</span>
              <span className="font-semibold text-foreground dark:text-white">
                {enrollment.progress}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden dark:bg-gray-700">
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

        <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t dark:text-gray-400 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Inscrito em{" "}
              {new Date(enrollment.enrolled_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
          {enrollment.completed && enrollment.completed_at && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
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
