// app/admin/courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface Course {
  id: string;
  title: string;
  slug: string;
  price: number;
  level: "iniciante" | "intermediario" | "avancado";
  category: string;
  published: boolean;
  updated_at: string;
}

export default function AdminCoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
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
      const { data: courses, error } = await supabase
        .from("courses")
        .select(
          "id, title, slug, price, level, category, published, updated_at"
        )
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar cursos:", error);
        return;
      }

      setCourses(courses || []);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setCoursesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p>Verificando acesso...</p>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cursos</CardTitle>
            <Button asChild className="btn btn-primary">
              <Link href="/admin/courses/new">Novo Curso</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <div className="text-center py-8">
                <Spinner size="md" className="mx-auto mb-2" />
                <p className="text-muted-foreground">Carregando cursos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nível
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Publicado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {course.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {course.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {course.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          R$ {course.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {course.published ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                              Sim
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                              Não
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            asChild
                          >
                            <Link href={`/admin/courses/${course.id}/edit`}>
                              Editar
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
