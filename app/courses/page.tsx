// app/courses/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import Link from "next/link";

export default async function CoursesPage() {
  const supabase = createServerClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-py">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Nossos <span className="gradient-text">Cursos</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Aprenda com cursos práticos e projetos reais
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => (
              <Card key={course.id} className="feature-card group">
                <CardHeader className="pb-4">
                  <div className="h-48 gradient-bg rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-5xl">📚</span>
                  </div>

                  <CardTitle className="text-xl line-clamp-2">
                    {course.title}
                  </CardTitle>

                  <CardDescription className="line-clamp-3">
                    {course.short_description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>🕒 {course.duration_hours}h</span>
                    <span>🎯 {course.level}</span>
                    <span>📁 {course.category}</span>
                  </div>

                  <div className="text-2xl font-bold text-primary">
                    {course.price === 0 ? "Gratuito" : `R$ ${course.price}`}
                  </div>

                  <div className="space-y-2">
                    <Button asChild className="w-full btn btn-primary">
                      <Link href={`/courses/${course.slug}`}>Ver Curso</Link>
                    </Button>

                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/checkout?course=${course.id}`}>
                        Comprar Agora
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
