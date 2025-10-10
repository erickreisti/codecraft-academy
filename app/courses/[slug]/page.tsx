// app/courses/[slug]/page.tsx - VERSÃO COM CLIENTE ADMIN
import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { CourseImage } from "@/components/ui/course-image";
import type { Course } from "@/types";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  // ✅ USAR CLIENTE ADMIN QUE IGNORA RLS
  const supabase = createAdminClient();

  try {
    console.log("🎯 Buscando curso com slug:", params.slug);

    // Query usando cliente admin (ignora RLS)
    const { data: course, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", params.slug)
      .single();

    console.log("📊 Resultado:", { course: course?.title, error });

    if (error) {
      console.error("❌ Erro na query:", error);
      notFound();
    }

    if (!course) {
      console.log("❌ Curso não encontrado");
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />

        <section className="section-py">
          <div className="container-custom max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* COLUNA DA ESQUERDA - CONTEÚDO */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {course.title}
                  </h1>
                  <p className="mt-4 text-xl text-muted-foreground">
                    {course.short_description || "Descrição do curso..."}
                  </p>
                </div>

                <div className="prose prose-lg max-w-none">
                  <p>
                    {course.description || "Descrição detalhada do curso..."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Duração:</span>
                    <p>{course.duration_hours || 0} horas</p>
                  </div>
                  <div>
                    <span className="font-semibold">Nível:</span>
                    <p className="capitalize">{course.level || "iniciante"}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Categoria:</span>
                    <p>{course.category || "Programação"}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Preço:</span>
                    <p>
                      {course.price === 0
                        ? "Gratuito"
                        : `R$ ${course.price?.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* COLUNA DA DIREITA - COMPRA */}
              <div className="space-y-6">
                <div className="feature-card p-6">
                  <div className="text-center space-y-4">
                    {/* IMAGEM */}
                    <div className="h-48 w-full rounded-lg overflow-hidden">
                      <CourseImage src={course.image_url} alt={course.title} />
                    </div>

                    {/* PREÇO */}
                    <div className="text-3xl font-bold text-primary">
                      {course.price === 0
                        ? "Gratuito"
                        : `R$ ${course.price?.toFixed(2)}`}
                    </div>

                    {/* BOTÕES */}
                    <div className="space-y-3">
                      <AddToCartButton course={course} size="lg" />

                      <Button variant="outline" className="w-full">
                        📋 Lista de Desejos
                      </Button>
                    </div>

                    {/* BENEFÍCIOS */}
                    <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>✅</span>
                        <span>Acesso vitalício</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✅</span>
                        <span>Certificado de conclusão</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>✅</span>
                        <span>Suporte da comunidade</span>
                      </div>
                      {course.price > 0 && (
                        <div className="flex items-center gap-2">
                          <span>✅</span>
                          <span>Garantia de 7 dias</span>
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
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    notFound();
  }
}
