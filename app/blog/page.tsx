import { Header } from "@/components/layout/header";
import { createServerClient } from "@/lib/supabase/server";
import { BlogImage } from "@/components/ui/blog-image";
import Link from "next/link";

export default async function BlogPage() {
  const supabase = createServerClient();

  // Buscar posts publicados
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar posts:", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-py">
        <div className="container-custom">
          {/* Cabeçalho do Blog */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Nosso <span className="gradient-text">Blog</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Artigos, tutoriais e insights sobre programação e carreira tech
            </p>
          </div>

          {/* Grid de Posts */}
          {posts && posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id} className="feature-card group">
                  {/* Imagem do Post */}
                  <div className="h-48 w-full rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    <BlogImage
                      src={post.image_url} // Se tiver campo image_url nos posts
                      alt={post.title}
                    />
                    {/* Overlay para melhor contraste */}
                    <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors"></div>
                  </div>

                  {/* Conteúdo do Post */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Data de publicação */}
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <span>
                        📅{" "}
                        {new Date(post.published_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>

                    {/* Botão de leitura */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="btn btn-primary w-full inline-block text-center"
                    >
                      Ler Artigo
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Se não há posts, renderiza estado vazio
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-bold mb-4">Blog em Construção</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Em breve teremos artigos incríveis para você!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
