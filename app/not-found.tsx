import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-py">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            {/* Design Mais Criativo */}
            <div className="relative mb-12">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl font-bold text-muted/20 select-none">
                  404
                </div>
              </div>

              <div className="relative z-10">
                <div className="text-8xl mb-6">👨‍💻</div>
                <h1 className="text-5xl font-bold mb-4">
                  Página em <span className="gradient-text">Modo Debug</span>
                </h1>
              </div>
            </div>

            {/* Mensagem Engajadora */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 mb-8 border">
              <p className="text-xl text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">
                  Console.log(&apos;Página não encontrada!&apos;);
                </span>
                <br />
                Parece que este endpoint retornou um 404. Mas não se preocupe,
                todo dev já passou por isso! 🐛
              </p>

              <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm">
                <span>⚠️</span>
                <span>Status: 404 - Not Found</span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <Link href="/" className="block">
                <div className="feature-card text-center p-6 group hover:scale-105 transition-transform">
                  <div className="text-3xl mb-3">🏠</div>
                  <h3 className="font-semibold mb-2">Home</h3>
                  <p className="text-sm text-muted-foreground">
                    Voltar ao início
                  </p>
                </div>
              </Link>

              <Link href="/courses" className="block">
                <div className="feature-card text-center p-6 group hover:scale-105 transition-transform">
                  <div className="text-3xl mb-3">📚</div>
                  <h3 className="font-semibold mb-2">Cursos</h3>
                  <p className="text-sm text-muted-foreground">
                    Aprenda programação
                  </p>
                </div>
              </Link>

              <Link href="/blog" className="block">
                <div className="feature-card text-center p-6 group hover:scale-105 transition-transform">
                  <div className="text-3xl mb-3">📝</div>
                  <h3 className="font-semibold mb-2">Blog</h3>
                  <p className="text-sm text-muted-foreground">
                    Leia nossos artigos
                  </p>
                </div>
              </Link>
            </div>

            {/* CTA Principal */}
            <div className="border-t pt-8">
              <p className="text-muted-foreground mb-6">
                Enquanto isso, que tal explorar nossa plataforma?
              </p>
              <Link href="/">
                <Button className="btn btn-primary btn-lg">
                  🚀 Explorar CodeCraft Academy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
