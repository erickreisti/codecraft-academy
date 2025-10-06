// app/courses/[slug]/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import Link from "next/link";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = createServerClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (error || !course) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-py">
        <div className="container-custom max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {course.title}
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                  {course.short_description}
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p>{course.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Duração:</span>
                  <p>{course.duration_hours} horas</p>
                </div>
                <div>
                  <span className="font-semibold">Nível:</span>
                  <p>{course.level}</p>
                </div>
                <div>
                  <span className="font-semibold">Categoria:</span>
                  <p>{course.category}</p>
                </div>
                <div>
                  <span className="font-semibold">Tipo:</span>
                  <p>{course.price === 0 ? "Gratuito" : "Premium"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="feature-card p-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🎯</div>

                  <div className="text-3xl font-bold text-primary">
                    {course.price === 0 ? "Gratuito" : `R$ ${course.price}`}
                  </div>

                  <div className="space-y-3">
                    <Button asChild className="w-full btn btn-primary btn-lg">
                      <Link href={`/checkout?course=${course.id}`}>
                        {course.price === 0
                          ? "Matricular-se Gratuitamente"
                          : "Comprar Curso"}
                      </Link>
                    </Button>

                    <Button variant="outline" className="w-full">
                      📋 Lista de Desejos
                    </Button>
                  </div>

                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>Acesso vitalício</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>Certificado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <span>Suporte</span>
                    </div>
                    {course.price > 0 && (
                      <div className="flex items-center gap-2">
                        <span>✅</span>
                        <span>Garantia 7 dias</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
