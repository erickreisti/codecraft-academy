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
import { CourseImage } from "@/components/ui/course-image";
import { getPublishedCourses } from "@/app/actions/course-actions";

export default async function CoursesPage() {
  // Usar Server Action para buscar cursos publicados
  const result = await getPublishedCourses();

  const courses = result.success ? result.data : [];

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
                  <div className="h-48 rounded-lg mb-4 relative overflow-hidden">
                    <CourseImage
                      src={course.image_url}
                      alt={course.title}
                      className="rounded-lg"
                    />
                    {/* OVERLAY PARA MELHOR CONTRASTE */}
                    <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors"></div>
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
