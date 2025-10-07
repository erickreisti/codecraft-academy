// app/courses/[slug]/page.tsx

/**
 * PÁGINA DE DETALHES DO CURSO
 *
 * Página individual de cada curso com:
 * - Informações completas do curso
 * - Seção de compra/inscrição
 * - Pré-requisitos e conteúdo
 * - Integração com carrinho
 *
 * Utiliza dynamic routes do Next.js com [slug]
 */

import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  // Cria cliente do Supabase
  const supabase = createServerClient();

  // Busca curso específico pelo slug
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true) // Apenas se estiver publicado
    .single(); // Espera um único resultado

  // Se não encontrar curso, mostra página 404
  if (error || !course) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-py">
        <div className="container-custom max-w-6xl">
          {/* LAYOUT EM DUAS COLUNAS */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* COLUNA DA ESQUERDA - CONTEÚDO DO CURSO */}
            <div className="space-y-6">
              {/* CABEÇALHO */}
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  {course.title}
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                  {course.short_description}
                </p>
              </div>

              {/* DESCRIÇÃO COMPLETA */}
              <div className="prose prose-lg max-w-none">
                <p>{course.description}</p>
              </div>

              {/* METADADOS DO CURSO */}
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

            {/* COLUNA DA DIREITA - AÇÕES DE COMPRA */}
            <div className="space-y-6">
              {/* CARD DE COMPRA */}
              <div className="feature-card p-6">
                <div className="text-center space-y-4">
                  {/* ÍCONE */}
                  <div className="text-4xl">🎯</div>

                  {/* PREÇO */}
                  <div className="text-3xl font-bold text-primary">
                    {course.price === 0 ? "Gratuito" : `R$ ${course.price}`}
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="space-y-3">
                    {/* BOTÃO PRINCIPAL - ADICIONAR AO CARRINHO OU ACESSAR GRATUITO */}
                    <AddToCartButton course={course} size="lg" />

                    {/* BOTÃO SECUNDÁRIO - LISTA DE DESEJOS */}
                    <Button variant="outline" className="w-full">
                      📋 Lista de Desejos
                    </Button>
                  </div>

                  {/* BENEFÍCIOS INCLUSOS */}
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

              {/* INFORMAÇÕES ADICIONAIS */}
              <div className="text-center text-sm text-muted-foreground">
                <p>🎁 30 dias de garantia incondicional</p>
                <p>💳 Parcele em até 12x no cartão</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
