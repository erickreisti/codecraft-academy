// app/courses/[slug]/page.tsx - VERSÃO COM ESPAÇAMENTOS MELHORADOS
import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { CourseImage } from "@/components/ui/course-image";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = createAdminClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !course) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-16 lg:py-24">
        {" "}
        {/* Padding vertical aumentado */}
        <div className="container-custom max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {" "}
            {/* Gap aumentado + alinhamento topo */}
            {/* COLUNA DA ESQUERDA - CONTEÚDO */}
            <div className="space-y-8">
              {" "}
              {/* Espaço entre seções aumentado */}
              {/* Cabeçalho */}
              <div className="space-y-6">
                {" "}
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                  {course.title}
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                  {course.short_description || "Descrição do curso..."}
                </p>
              </div>
              {/* Descrição Completa */}
              <div className="prose prose-lg max-w-none space-y-6">
                {" "}
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {course.description || "Descrição detalhada do curso..."}
                </p>
              </div>
              {/* Metadados */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                {" "}
                <div className="space-y-2">
                  {" "}
                  <span className="font-semibold text-foreground">
                    Duração:
                  </span>
                  <p className="text-muted-foreground">
                    {course.duration_hours || 0} horas
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="font-semibold text-foreground">Nível:</span>
                  <p className="text-muted-foreground capitalize">
                    {course.level || "iniciante"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="font-semibold text-foreground">
                    Categoria:
                  </span>
                  <p className="text-muted-foreground">
                    {course.category || "Programação"}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="font-semibold text-foreground">Preço:</span>
                  <p className="text-muted-foreground">
                    {course.price === 0
                      ? "Gratuito"
                      : `R$ ${course.price?.toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>
            {/* COLUNA DA DIREITA - COMPRA */}
            <div className="space-y-8">
              {" "}
              <div className="feature-card p-8 space-y-8 sticky top-24">
                {" "}
                <div className="text-center space-y-6">
                  {" "}
                  {/* IMAGEM */}
                  <div className="h-64 w-full rounded-xl overflow-hidden">
                    {" "}
                    <CourseImage
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* PREÇO */}
                  <div className="text-4xl font-bold text-primary">
                    {" "}
                    {course.price === 0
                      ? "Gratuito"
                      : `R$ ${course.price?.toFixed(2)}`}
                  </div>
                  {/* BOTÕES */}
                  <div className="space-y-4">
                    {" "}
                    <AddToCartButton course={course} size="lg" />
                    <Button variant="outline" className="w-full py-3 text-base">
                      {" "}
                      📋 Lista de Desejos
                    </Button>
                  </div>
                  {/* BENEFÍCIOS */}
                  <div className="pt-6 space-y-4 text-sm text-muted-foreground border-t">
                    {" "}
                    <div className="flex items-center gap-3">
                      {" "}
                      <span className="text-green-500 text-lg">✅</span>
                      <span>Acesso vitalício</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 text-lg">✅</span>
                      <span>Certificado de conclusão</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 text-lg">✅</span>
                      <span>Suporte da comunidade</span>
                    </div>
                    {course.price > 0 && (
                      <div className="flex items-center gap-3">
                        <span className="text-green-500 text-lg">✅</span>
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
}
