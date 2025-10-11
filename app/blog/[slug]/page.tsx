import { Header } from "@/components/layout/header";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogImage } from "@/components/ui/blog-image";

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

      <article className="py-20 lg:py-28">
        {" "}
        {/* Padding vertical aumentado */}
        <div className="container-custom max-w-4xl">
          {/* Cabeçalho do Post */}
          <header className="text-center mb-16">
            {" "}
            {/* Margem inferior aumentada */}
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8 leading-tight">
              {" "}
              {/* Mais espaço + melhor leading */}
              {post.title}
            </h1>
            <div className="text-lg text-muted-foreground flex items-center justify-center gap-4">
              {" "}
              {/* Texto maior + gap */}
              <time
                dateTime={post.published_at}
                className="flex items-center gap-2"
              >
                <span className="text-xl">📅</span>
                {new Date(post.published_at).toLocaleDateString("pt-BR")}
              </time>
              <span className="text-muted-foreground">•</span>
              <span className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                {Math.ceil((post.content?.length || 0) / 1000)} min de leitura
              </span>
            </div>
          </header>

          {/* Imagem do Post */}
          {post.image_url && (
            <div className="h-96 rounded-3xl mb-16 relative overflow-hidden">
              {" "}
              {/* Altura aumentada + border radius */}
              <BlogImage
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          {/* Conteúdo do Post */}
          <div className="prose prose-lg max-w-none space-y-8">
            {" "}
            {/* Espaço entre elementos */}
            {/* Resumo do artigo */}
            {post.excerpt && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 mb-8">
                {" "}
                {/* Padding aumentado */}
                <p className="text-xl text-blue-800 dark:text-blue-200 leading-relaxed italic text-center">
                  {post.excerpt}
                </p>
              </div>
            )}
            {/* Conteúdo principal */}
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              {" "}
              {/* Texto maior e mais legível */}
              {post.content ? (
                <div
                  className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:leading-relaxed prose-p:mb-6"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6">🚧</div>
                  <h3 className="text-2xl font-bold mb-4">
                    Conteúdo em Desenvolvimento
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Este artigo está sendo preparado com muito cuidado. Volte em
                    breve!
                  </p>
                </div>
              )}
            </div>
            {/* Divisor visual */}
            <div className="border-t pt-12 mt-12">
              {" "}
              {/* Padding e margem aumentados */}
              <div className="text-center text-sm text-muted-foreground">
                Artigo publicado em{" "}
                {new Date(post.published_at).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Call-to-action */}
          <div className="text-center mt-20 pt-16 border-t">
            {" "}
            {/* Margem top maior + padding + borda */}
            <h3 className="text-2xl lg:text-3xl font-bold mb-6">
              Gostou do artigo?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Aprenda na prática com nossos cursos e transforme sua carreira em
              tecnologia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn btn-primary btn-lg">
                🚀 Explorar Cursos
              </Link>
              <Link href="/blog" className="btn btn-secondary btn-lg">
                📚 Ver Mais Artigos
              </Link>
            </div>
          </div>

          {/* Navegação entre posts */}
          <div className="mt-16 pt-12 border-t">
            {" "}
            {/* Margem e padding aumentados */}
            <div className="flex justify-between items-center">
              <Link
                href="/blog"
                className="btn btn-outline flex items-center gap-2 group"
              >
                ← Voltar para o Blog
              </Link>
              <Link
                href="/courses"
                className="btn btn-primary flex items-center gap-2 group"
              >
                Ver Cursos →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
