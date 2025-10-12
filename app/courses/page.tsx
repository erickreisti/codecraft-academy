import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import Link from "next/link";
import { CourseImage } from "@/components/ui/course-image";
import { getPublishedCourses } from "@/app/actions/admin-actions";
import {
  Clock,
  Target,
  FolderOpen,
  Star,
  Users,
  BookOpen,
  Search,
  Filter,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

export default async function CoursesPage() {
  const result = await getPublishedCourses();
  const courses = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO SECTION */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Nossos{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cursos
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8">
              Aprenda com cursos práticos, projetos reais e mentoria
              especializada para transformar sua carreira em tecnologia
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  50+
                </div>
                <div className="text-sm text-muted-foreground">Cursos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  5.000+
                </div>
                <div className="text-sm text-muted-foreground">Alunos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  98%
                </div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  4.9
                </div>
                <div className="text-sm text-muted-foreground">Avaliação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS E PESQUISA */}
      <section className="py-8 border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full">
                Todos
              </Button>
              <Button variant="ghost" className="rounded-full">
                Frontend
              </Button>
              <Button variant="ghost" className="rounded-full">
                Backend
              </Button>
              <Button variant="ghost" className="rounded-full">
                Fullstack
              </Button>
              <Button variant="ghost" className="rounded-full">
                Mobile
              </Button>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* GRID DE CURSOS */}
      <section className="py-16 lg:py-20">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses?.map((course) => (
              <Card
                key={course.id}
                className="group hover-lift border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-300 hover:shadow-xl overflow-hidden"
              >
                <CardHeader className="pb-4 p-0">
                  {/* IMAGEM DO CURSO */}
                  <div className="h-48 rounded-t-xl relative overflow-hidden">
                    <CourseImage
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay escuro para melhor contraste */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badge de nível */}
                    <div className="absolute top-3 left-3 z-10">
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${
                          course.level === "iniciante"
                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/80 dark:text-green-200 dark:border-green-700"
                            : course.level === "intermediario"
                            ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/80 dark:text-blue-200 dark:border-blue-700"
                            : "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/80 dark:text-purple-200 dark:border-purple-700"
                        }`}
                      >
                        {course.level}
                      </div>
                    </div>

                    {/* Overlay de ação MELHORADO */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 p-4">
                      <div className="text-center space-y-4 w-full">
                        {/* Ícone principal */}
                        <div className="w-14 h-14 mx-auto bg-white/95 dark:bg-gray-900/95 rounded-xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 mb-2">
                          <PlayCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                        </div>

                        {/* Texto informativo */}
                        <div className="space-y-2">
                          <h3 className="text-white font-semibold text-base drop-shadow-lg">
                            Ver Curso
                          </h3>
                          <p className="text-white/90 text-xs drop-shadow-lg leading-relaxed px-2">
                            Clique para ver detalhes completos e conteúdo
                            programático
                          </p>
                        </div>

                        {/* Badge de destaque */}
                        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg mt-1">
                          <BookOpen className="h-3 w-3" />
                          <span>Conteúdo Exclusivo</span>
                        </div>
                      </div>
                    </div>

                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-xl" />
                  </div>

                  <div className="p-5 pb-0">
                    {/* TÍTULO E DESCRIÇÃO */}
                    <CardTitle className="text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>

                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                      {course.short_description ||
                        "Domine as tecnologias mais demandadas do mercado com projetos práticos."}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 p-5 pt-0">
                  {/* METADADOS DO CURSO */}
                  <div className="grid grid-cols-3 gap-3 py-3 border-y">
                    <div className="text-center">
                      <div className="w-9 h-9 mx-auto bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-1.5">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {course.duration_hours}h
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Duração
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="w-9 h-9 mx-auto bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-1.5">
                        <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-sm font-medium text-foreground capitalize">
                        {course.level}
                      </div>
                      <div className="text-xs text-muted-foreground">Nível</div>
                    </div>

                    <div className="text-center">
                      <div className="w-9 h-9 mx-auto bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-1.5">
                        <FolderOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {course.category}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Categoria
                      </div>
                    </div>
                  </div>

                  {/* PREÇO E AVALIAÇÃO */}
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-primary">
                        {course.price === 0
                          ? "Gratuito"
                          : `R$ ${course.price?.toFixed(2)}`}
                      </div>
                      {course.price !== 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.9 (250)</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>1.2k</span>
                    </div>
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="space-y-2">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 text-sm transition-all duration-300 hover:scale-105"
                    >
                      <Link
                        href={`/courses/${course.slug}`}
                        className="flex items-center justify-center gap-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        Ver Detalhes
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>

                    <AddToCartButton
                      course={course}
                      variant="outline"
                      size="sm"
                      className="w-full py-2.5 text-sm border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* MENSAGEM PARA NENHUM CURSO */}
          {(!courses || courses.length === 0) && (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Nenhum curso encontrado
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Estamos preparando cursos incríveis para você. Volte em breve
                para conferir as novidades!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn btn-primary">
                  <Link href="/" className="flex items-center gap-2">
                    Voltar para Home
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact" className="flex items-center gap-2">
                    Entrar em Contato
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* CALL TO ACTION */}
          {courses && courses.length > 0 && (
            <div className="text-center mt-16 pt-12 border-t">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                  Não encontrou o que procurava?
                </h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Temos novos cursos sendo lançados constantemente. Entre em
                  contato e nos diga qual tecnologia você gostaria de aprender!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="btn btn-primary">
                    <Link href="/contact" className="flex items-center gap-2">
                      Falar com Consultor
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/blog" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Ler Blog
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
