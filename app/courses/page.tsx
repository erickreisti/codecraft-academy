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
  const result = await getPublishedCourses();
  const courses = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20 lg:py-28">
        <div className="container-custom">
          {/* CABEÇALHO DA PÁGINA */}
          <div className="text-center mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8">
              Nossos <span className="gradient-text">Cursos</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Aprenda com cursos práticos e projetos reais que transformam
              carreiras
            </p>
          </div>

          {/* GRID DE CURSOS */}
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => (
              <Card
                key={course.id}
                className="feature-card group hover-lift transition-all duration-300"
              >
                <CardHeader className="pb-6">
                  {/* IMAGEM/THUMBNAIL DO CURSO */}
                  <div className="h-56 rounded-xl mb-6 relative overflow-hidden">
                    <CourseImage
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  </div>

                  {/* TÍTULO E DESCRIÇÃO */}
                  <CardTitle className="text-xl lg:text-2xl leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>

                  <CardDescription className="line-clamp-3 leading-relaxed text-base">
                    {course.short_description ||
                      "Descrição do curso em breve..."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* METADADOS DO CURSO */}
                  <div className="flex justify-between items-center text-sm text-muted-foreground py-3 border-y">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">🕒</span>
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">🎯</span>
                      <span className="capitalize">{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">📁</span>
                      <span>{course.category}</span>
                    </div>
                  </div>

                  {/* PREÇO */}
                  <div className="text-3xl font-bold text-primary text-center">
                    {course.price === 0
                      ? "Gratuito"
                      : `R$ ${course.price?.toFixed(2)}`}
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="space-y-3">
                    {/* BOTÃO VER CURSO - CORRIGIDO */}
                    <Button
                      asChild
                      className="w-full btn btn-primary py-3 text-base"
                    >
                      <Link href={`/courses/${course.slug}`}>
                        👀 Ver Detalhes do Curso
                      </Link>
                    </Button>

                    {/* BOTÃO ADICIONAR AO CARRINHO - CORRIGIDO */}
                    <AddToCartButton
                      course={course}
                      variant="outline"
                      size="lg"
                      className="py-3 text-base"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* MENSAGEM PARA NENHUM CURSO ENCONTRADO */}
          {(!courses || courses.length === 0) && (
            <div className="text-center py-24">
              <div className="text-7xl mb-8">📚</div>
              <h2 className="text-3xl font-bold mb-6">
                Nenhum curso encontrado
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Estamos preparando cursos incríveis para você. Volte em breve!
              </p>
              <Button asChild className="btn btn-primary btn-lg">
                <Link href="/">🏠 Voltar para Home</Link>
              </Button>
            </div>
          )}

          {/* CALL TO ACTION EXTRA */}
          {courses && courses.length > 0 && (
            <div className="text-center mt-20 pt-16 border-t">
              <h3 className="text-2xl lg:text-3xl font-bold mb-6">
                Não encontrou o que procurava?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Temos novos cursos sendo lançados constantemente. Entre em
                contato e nos diga o que você gostaria de aprender!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn btn-primary btn-lg">
                  <Link href="/contact">📞 Falar com Consultor</Link>
                </Button>
                <Button asChild className="btn btn-secondary btn-lg">
                  <Link href="/blog">📝 Ler Nosso Blog</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
