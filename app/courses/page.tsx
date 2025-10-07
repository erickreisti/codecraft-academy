// app/courses/page.tsx

/**
 * PÁGINA DE LISTAGEM DE CURSOS
 *
 * Página que mostra todos os cursos disponíveis na plataforma
 *
 * Funcionalidades:
 * - Lista cursos com paginação
 * - Filtros por categoria, nível, preço
 * - Layout de cards responsivo
 * - Integração com carrinho de compras
 * - Server-side rendering para SEO
 */

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
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import Link from "next/link";

export default async function CoursesPage() {
  // Cria cliente do Supabase para Server Component
  const supabase = createServerClient();

  // Busca cursos do banco de dados
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true) // Apenas cursos publicados
    .order("created_at", { ascending: false }); // Mais recentes primeiro

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-py">
        <div className="container-custom">
          {/* CABEÇALHO DA PÁGINA */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Nossos <span className="gradient-text">Cursos</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Aprenda com cursos práticos e projetos reais
            </p>
          </div>

          {/* GRID DE CURSOS */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => (
              <Card key={course.id} className="feature-card group">
                <CardHeader className="pb-4">
                  {/* IMAGEM/THUMBNAIL DO CURSO */}
                  <div className="h-48 gradient-bg rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-5xl">📚</span>
                  </div>

                  {/* TÍTULO E DESCRIÇÃO */}
                  <CardTitle className="text-xl line-clamp-2">
                    {course.title}
                  </CardTitle>

                  <CardDescription className="line-clamp-3">
                    {course.short_description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* METADADOS DO CURSO */}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>🕒 {course.duration_hours}h</span>
                    <span>🎯 {course.level}</span>
                    <span>📁 {course.category}</span>
                  </div>

                  {/* PREÇO */}
                  <div className="text-2xl font-bold text-primary">
                    {course.price === 0 ? "Gratuito" : `R$ ${course.price}`}
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="space-y-2">
                    {/* BOTÃO VER CURSO */}
                    <Button asChild className="w-full btn btn-primary">
                      <Link href={`/courses/${course.slug}`}>Ver Curso</Link>
                    </Button>

                    {/* BOTÃO ADICIONAR AO CARRINHO */}
                    <AddToCartButton
                      course={course}
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* MENSAGEM PARA NENHUM CURSO ENCONTRADO */}
          {(!courses || courses.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">
                Nenhum curso encontrado
              </h2>
              <p className="text-muted-foreground">
                Em breve teremos novos cursos disponíveis.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
