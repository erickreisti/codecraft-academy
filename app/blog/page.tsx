// app/blog/page.tsx - VERSÃO CORRIGIDA
import { Header } from "@/components/layout/header";
import { BlogImage } from "@/components/ui/blog-image";
import Link from "next/link";
import { getPublishedPosts } from "@/app/actions/admin-actions";

export default async function BlogPage() {
  // ✅ USAR SERVER ACTION UNIFICADA
  const result = await getPublishedPosts();
  const posts = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20 lg:py-28">
        <div className="container-custom">
          {/* Cabeçalho do Blog */}
          <div className="text-center mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Nosso <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Artigos, tutoriais e insights sobre programação e carreira tech
            </p>
          </div>

          {/* Grid de Posts */}
          {posts && posts.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="feature-card group hover-lift transition-all duration-300"
                >
                  {/* Imagem do Post */}
                  <div className="h-56 w-full rounded-t-lg flex items-center justify-center relative overflow-hidden mb-6">
                    <BlogImage
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  </div>

                  {/* Conteúdo do Post */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt || "Leia mais sobre este artigo..."}
                    </p>

                    {/* Metadados */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                      <span>
                        📅{" "}
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString(
                              "pt-BR"
                            )
                          : "Data não disponível"}
                      </span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {/* Calcular tempo de leitura baseado no conteúdo */}
                        {post.content
                          ? `${Math.ceil(post.content.length / 1000)} min`
                          : "5 min"}
                      </span>
                    </div>

                    {/* Botão de leitura */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="btn btn-primary w-full inline-block text-center mt-4"
                    >
                      Ler Artigo →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            // Estado vazio
            <div className="text-center py-20">
              <div className="text-7xl mb-8">📝</div>
              <h2 className="text-3xl font-bold mb-6">Blog em Construção</h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8 leading-relaxed">
                Em breve teremos artigos incríveis para você!
              </p>
              <Link href="/courses" className="btn btn-primary btn-lg">
                🚀 Explorar Cursos
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
