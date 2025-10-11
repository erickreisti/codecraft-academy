// app/courses/[slug]/page.tsx - VERSÃO MELHORADA
import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { CourseImage } from "@/components/ui/course-image";
import {
  Clock,
  Target,
  FolderOpen,
  DollarSign,
  CheckCircle,
  Users,
  Star,
  BookOpen,
  Award,
  Shield,
  Heart,
} from "lucide-react";

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

      {/* Hero Section do Curso */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="container-custom max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* COLUNA DA ESQUERDA - CONTEÚDO */}
            <div className="space-y-10">
              {/* Cabeçalho */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <FolderOpen className="h-4 w-4" />
                  {course.category}
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                  {course.title}
                </h1>

                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                  {course.short_description ||
                    "Domine as tecnologias mais demandadas do mercado com projetos práticos e mentoria especializada."}
                </p>
              </div>

              {/* Avaliação e Alunos */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="font-semibold">4.9</span>
                  <span className="text-muted-foreground">
                    (1.2k avaliações)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span>2.5k alunos matriculados</span>
                </div>
              </div>

              {/* Descrição Completa */}
              <div className="prose prose-lg max-w-none space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {course.description ||
                    "Este curso foi desenvolvido para proporcionar uma experiência de aprendizado completa e prática. Você vai construir projetos reais, aprender as melhores práticas do mercado e se preparar para oportunidades profissionais."}
                </p>
              </div>

              {/* Metadados em Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold text-foreground">
                    {course.duration_hours || 0}h
                  </div>
                  <div className="text-sm text-muted-foreground">Duração</div>
                </div>

                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-bold text-foreground capitalize">
                    {course.level || "iniciante"}
                  </div>
                  <div className="text-sm text-muted-foreground">Nível</div>
                </div>

                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-bold text-foreground">12</div>
                  <div className="text-sm text-muted-foreground">Módulos</div>
                </div>

                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                  <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="font-bold text-foreground">Sim</div>
                  <div className="text-sm text-muted-foreground">
                    Certificado
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA DA DIREITA - COMPRA */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border p-8 space-y-8 sticky top-24">
                {/* IMAGEM */}
                <div className="h-48 rounded-xl overflow-hidden">
                  <CourseImage
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* PREÇO */}
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {course.price === 0
                      ? "Gratuito"
                      : `R$ ${course.price?.toFixed(2)}`}
                  </div>
                  {course.price > 0 && (
                    <div className="text-sm text-muted-foreground">
                      ou 12x de R$ {(course.price / 12).toFixed(2)}
                    </div>
                  )}
                </div>

                {/* BOTÕES */}
                <div className="space-y-4">
                  <AddToCartButton
                    course={course}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg transition-all duration-300 hover:scale-105"
                  />

                  <Button
                    variant="outline"
                    className="w-full py-4 text-lg border-2 hover:bg-accent hover:scale-105 transition-all duration-300"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Lista de Desejos
                  </Button>
                </div>

                {/* GARANTIA */}
                {course.price > 0 && (
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-700 dark:text-green-300">
                      Garantia de 7 dias ou seu dinheiro de volta
                    </div>
                  </div>
                )}

                {/* BENEFÍCIOS */}
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Acesso vitalício</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Certificado de conclusão</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Suporte da comunidade</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Atualizações gratuitas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
