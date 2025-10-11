// app/admin/courses/page.tsx - VERSÃO MELHORADA
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ArrowLeft,
  Filter,
  Search,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAdminCourses, deleteCourse } from "@/app/actions/admin-actions";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  slug: string;
  price: number;
  level: "iniciante" | "intermediario" | "avancado";
  category: string;
  published: boolean;
  featured: boolean;
  image_url?: string;
  duration_hours: number;
  created_at: string;
  updated_at: string;
}

export default function AdminCoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<
    "all" | "published" | "draft" | "featured"
  >("all");
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
        return;
      }

      setUser(user);

      // Verificar se é admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userIsAdmin = profile?.role === "admin";
      setIsAdmin(userIsAdmin);

      if (!userIsAdmin) {
        router.push("/");
        return;
      }

      // Se é admin, carregar cursos
      loadCourses();
    } catch (error) {
      console.error("Erro na verificação:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      setCoursesLoading(true);

      // Usar Server Action
      const result = await getAdminCourses();

      if (!result.success) {
        console.error("Erro ao carregar cursos:", result.error);
        toast.error("Erro ao carregar cursos");
        return;
      }

      setCourses(result.data || []);
      console.log(`✅ ${result.data?.length || 0} cursos carregados`);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      toast.error("Erro ao carregar cursos");
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir o curso "${courseTitle}"?`)) {
      return;
    }

    try {
      const result = await deleteCourse(courseId);

      if (!result.success) {
        toast.error("Erro ao excluir curso", {
          description: result.error,
        });
        return;
      }

      toast.success("Curso excluído com sucesso!");

      // Atualizar lista local
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Erro ao excluir curso:", error);
      toast.error("Erro ao excluir curso");
    }
  };

  const togglePublishStatus = async (
    courseId: string,
    currentStatus: boolean
  ) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ published: !currentStatus })
        .eq("id", courseId);

      if (error) throw error;

      // Atualizar lista local
      setCourses(
        courses.map((course) =>
          course.id === courseId
            ? { ...course, published: !currentStatus }
            : course
        )
      );

      toast.success(
        `Curso ${!currentStatus ? "publicado" : "despublicado"} com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status do curso");
    }
  };

  // Filtrar cursos baseado no search e filter
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "published"
        ? course.published
        : filter === "draft"
        ? !course.published
        : filter === "featured"
        ? course.featured
        : true;

    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.published).length,
    draft: courses.filter((c) => !c.published).length,
    featured: courses.filter((c) => c.featured).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <Spinner size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Verificando acesso...</h2>
            <p className="text-muted-foreground">Carregando painel de cursos</p>
          </div>
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
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                Gerenciar Cursos
              </h1>
            </div>
            <p className="text-muted-foreground">
              Crie, edite e gerencie todos os cursos da plataforma
            </p>
          </div>
          <Button asChild className="btn btn-primary gap-2">
            <Link href="/admin/courses/new">
              <Plus className="h-4 w-4" />
              Novo Curso
            </Link>
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4 hover-lift">
            <CardContent className="p-0 space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover-lift">
            <CardContent className="p-0 space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {stats.published}
              </div>
              <div className="text-sm text-muted-foreground">Publicados</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover-lift">
            <CardContent className="p-0 space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {stats.draft}
              </div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover-lift">
            <CardContent className="p-0 space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {stats.featured}
              </div>
              <div className="text-sm text-muted-foreground">Destaques</div>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS E BUSCA */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  {[
                    { value: "all", label: "Todos" },
                    { value: "published", label: "Publicados" },
                    { value: "draft", label: "Rascunhos" },
                    { value: "featured", label: "Destaques" },
                  ].map((filterOption) => (
                    <Button
                      key={filterOption.value}
                      variant={
                        filter === filterOption.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setFilter(filterOption.value as any)}
                      className="gap-2"
                    >
                      <Filter className="h-3 w-3" />
                      {filterOption.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* LISTA DE CURSOS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>Cursos ({filteredCourses.length})</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredCourses.length} de {courses.length} cursos
            </div>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <div className="text-center py-12">
                <Spinner size="md" className="mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando cursos...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || filter !== "all"
                    ? "Nenhum curso encontrado"
                    : "Nenhum curso criado"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || filter !== "all"
                    ? "Tente ajustar os filtros ou termos de busca"
                    : "Comece criando seu primeiro curso"}
                </p>
                <Button asChild className="btn btn-primary">
                  <Link href="/admin/courses/new">
                    <Plus className="h-4 w-4" />
                    Criar Primeiro Curso
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          {course.featured && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-3 w-3" />
                              Destaque
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>{course.category}</span>
                          <span>•</span>
                          <span className="capitalize">{course.level}</span>
                          <span>•</span>
                          <span>{course.duration_hours}h</span>
                          <span>•</span>
                          <span>R$ {course.price.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Criado em{" "}
                            {new Date(course.created_at).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                          {course.updated_at !== course.created_at && (
                            <>
                              <span>•</span>
                              <span>
                                Editado em{" "}
                                {new Date(course.updated_at).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <Badge
                        variant={course.published ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {course.published ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Publicado
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Rascunho
                          </>
                        )}
                      </Badge>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            togglePublishStatus(course.id, course.published)
                          }
                          title={course.published ? "Despublicar" : "Publicar"}
                        >
                          {course.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/courses/${course.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() =>
                            handleDeleteCourse(course.id, course.title)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
