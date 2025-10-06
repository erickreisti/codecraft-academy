import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-py">
        <div className="container-custom">
          {/* Cabeçalho */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Nosso <span className="gradient-text">Blog</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Artigos, tutoriais e insights sobre programação e carreira tech
            </p>
          </div>

          {/* Placeholder - Blog em construção */}
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-bold mb-4">Blog em Construção</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Estamos preparando conteúdo incrível sobre programação, carreira e
              tecnologia. Em breve teremos artigos exclusivos para você!
            </p>
            <Button className="btn btn-primary">
              Me avise quando estiver pronto
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
