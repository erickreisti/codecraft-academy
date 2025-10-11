// app/blog/[slug]/page.tsx - VERSÃO MELHORADA
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogImage } from "@/components/ui/blog-image";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  BookOpen,
  User,
  MessageCircle,
} from "lucide-react";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createServerClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="py-16 lg:py-24">
        <div className="container-custom max-w-4xl">
          {/* Cabeçalho do Post */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <BookOpen className="h-4 w-4" />
              Tutorial
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-lg text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Por Equipe CodeCraft</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  {Math.ceil((post.content?.length || 0) / 1000)} min de leitura
                </span>
              </div>
            </div>
          </header>

          {/* Imagem do Post */}
          {post.image_url && (
            <div className="h-80 lg:h-96 rounded-3xl mb-16 relative overflow-hidden">
              <BlogImage
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          {/* Conteúdo do Post */}
          <div className="prose prose-lg max-w-none">
            {/* Resumo do artigo */}
            {post.excerpt && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 mb-12">
                <p className="text-xl text-blue-800 dark:text-blue-200 leading-relaxed text-center font-medium">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* Conteúdo principal */}
            <div className="space-y-8">
              {post.content ? (
                <div
                  className="prose prose-lg max-w-none 
                    prose-headings:font-bold prose-headings:text-foreground 
                    prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:text-lg
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-4 prose-blockquote:px-6
                    prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-gray-900 prose-pre:text-gray-100"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Conteúdo em Desenvolvimento
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Este artigo está sendo preparado com muito cuidado e em
                    breve estará disponível. Agradecemos sua paciência!
                  </p>
                </div>
              )}
            </div>

            {/* Divisor e informações */}
            <div className="border-t pt-12 mt-16">
              <div className="text-center text-sm text-muted-foreground">
                Publicado em{" "}
                {new Date(post.published_at).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Ações do Artigo */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-12 p-6 bg-muted/50 rounded-2xl">
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>Deixe seu comentário</span>
            </div>
          </div>

          {/* Call-to-action */}
          <div className="text-center mt-20 pt-16 border-t">
            <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-foreground">
              Gostou do conteúdo?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Aprenda na prática com nossos cursos e transforme sua carreira em
              tecnologia com projetos reais e mentoria especializada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Explorar Cursos
              </Link>
              <Link href="/blog" className="btn btn-outline">
                Ver Mais Artigos
              </Link>
            </div>
          </div>

          {/* Navegação */}
          <div className="mt-16 pt-12 border-t">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link
                href="/blog"
                className="btn btn-outline flex items-center gap-2 group"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o Blog
              </Link>

              <Link
                href="/courses"
                className="btn btn-primary flex items-center gap-2 group bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Ver Todos os Cursos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
