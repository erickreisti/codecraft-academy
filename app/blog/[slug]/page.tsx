import { Header } from "@/components/layout/header";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createServerClient();

  // Buscar post pelo slug
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (error || !post) {
    notFound(); // ← Chama automaticamente a página 404
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="section-py">
        <div className="container-custom max-w-4xl">
          {/* Cabeçalho do Post */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              {post.title}
            </h1>
            <div className="text-muted-foreground">
              <time dateTime={post.published_at}>
                📅 {new Date(post.published_at).toLocaleDateString("pt-BR")}
              </time>
            </div>
          </header>

          {/* Imagem do Post */}
          <div className="h-80 gradient-bg rounded-2xl flex items-center justify-center mb-12">
            <span className="text-white text-8xl">📝</span>
          </div>

          {/* Conteúdo do Post */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {post.excerpt}
            </p>

            <div className="bg-muted/30 rounded-2xl p-8 mb-8">
              <p className="text-lg italic">
                {post.content || "Conteúdo do artigo em desenvolvimento..."}
              </p>
            </div>
          </div>

          {/* Call-to-action */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-4">Gostou do artigo?</h3>
            <p className="text-muted-foreground mb-6">
              Confira nossos cursos e acelere sua carreira em programação
            </p>
            <a href="/courses" className="btn btn-primary btn-lg">
              Explorar Cursos
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
