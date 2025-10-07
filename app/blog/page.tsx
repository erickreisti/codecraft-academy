import { Header } from "@/components/layout/header";
import { createServerClient } from "@/lib/supabase/server"; // Cliente servidor

export default async function BlogPage() {
  // Componente async pois busca dados no servidor
  const supabase = createServerClient(); // Cria cliente

  // Buscar posts publicados
  const { data: posts, error } = await supabase
    // Query no Supabase
    .from("posts") // Tabela posts
    .select("*") // Seleciona todas colunas
    .eq("published", true) // Apenas posts publicados
    .order("published_at", { ascending: false }); // Ordena por data (mais recente primeiro)

  if (error) {
    console.error("Erro ao buscar posts:", error); // Log do erro
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
          {posts && posts.length > 0 ? ( // Se há posts, renderiza grid
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Grid responsivo */}
              {posts.map((post) => (
                <div key={post.id} className="feature-card group">
                  {/* Card de post com hover effects */}

                  {/* Imagem do Post */}
                  <div className="h-48 w-full gradient-bg rounded-t-lg flex items-center justify-center p-8">
                    {/* Container da imagem com gradiente */}
                    <span className="text-white text-6xl">📝</span>
                    {/* Emoji placeholder */}
                  </div>

                  {/* Conteúdo do Post */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 line-clamp-2">
                      {/* Título limitado a 2 linhas */}
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {/* Resumo limitado a 3 linhas */}
                      {post.excerpt}
                    </p>

                    {/* Data de publicação */}
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <span>
                        📅{" "}
                        {new Date(post.published_at).toLocaleDateString(
                          "pt-BR"
                        )}
                        {/* Formata data em português */}
                      </span>
                    </div>

                    {/* Botão de leitura */}
                    <a
                      href={`/blog/${post.slug}`}
                      className="btn btn-primary w-full inline-block text-center"
                    >
                      Ler Artigo
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Se não há posts, renderiza estado vazio
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📝</div>
              {/* Emoji grande */}
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
