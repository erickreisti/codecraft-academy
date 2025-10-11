// app/blog/page.tsx - VERSÃO MELHORADA
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogImage } from "@/components/ui/blog-image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPublishedPosts } from "@/app/actions/admin-actions";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Search,
  Filter,
} from "lucide-react";

export default async function BlogPage() {
  const result = await getPublishedPosts();
  const posts = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Nosso{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8">
              Artigos, tutoriais e insights sobre programação, carreira tech e
              as tecnologias mais atuais do mercado
            </p>

            {/* Barra de Pesquisa */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  className="w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
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
                Carreira
              </Button>
              <Button variant="ghost" className="rounded-full">
                Dicas
              </Button>
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>
      </section>

      {/* Grid de Posts */}
      <section className="py-16 lg:py-20">
        <div className="container-custom">
          {posts && posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift border overflow-hidden"
                >
                  {/* Imagem do Post */}
                  <div className="h-48 relative overflow-hidden">
                    <BlogImage
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Categoria */}
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-full text-xs font-medium text-foreground backdrop-blur-sm">
                        Tutorial
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Post */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed line-clamp-3 min-h-[4.5rem]">
                      {post.excerpt ||
                        "Descubra as melhores práticas e técnicas para evoluir na sua carreira em tecnologia..."}
                    </p>

                    {/* Metadados */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString(
                                  "pt-BR"
                                )
                              : "Em breve"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {post.content
                              ? `${Math.ceil(post.content.length / 1000)} min`
                              : "5 min"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botão de leitura */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 mt-4"
                    >
                      Ler Artigo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            // Estado vazio
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Blog em Construção
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Estamos preparando artigos incríveis sobre programação e
                carreira tech. Volte em breve para conferir o conteúdo!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses" className="btn btn-primary">
                  Explorar Cursos
                </Link>
                <Link href="/" className="btn btn-outline">
                  Voltar para Home
                </Link>
              </div>
            </div>
          )}

          {/* Newsletter */}
          {posts && posts.length > 0 && (
            <div className="text-center mt-20 pt-16 border-t">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                  Receba os novos artigos
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Cadastre-se e receba os melhores conteúdos sobre programação
                  diretamente no seu email
                </p>
                <div className="flex gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="flex-1 px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Cadastrar
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
