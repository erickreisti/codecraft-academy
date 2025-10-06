import { Header } from "@/components/layout/header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-py">
        <div className="container-custom">
          {/* Hero Sobre */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Sobre a <span className="gradient-text">CodeCraft</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Transformando vidas através da educação em tecnologia
            </p>
          </div>

          {/* Conteúdo */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground mb-6">
                A CodeCraft Academy nasceu da paixão por ensinar programação de
                forma acessível e prática. Acreditamos que qualquer pessoa pode
                aprender a programar, independente de sua formação ou
                experiência anterior.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Nossa metodologia combina teoria sólida com projetos reais,
                preparando você não apenas para entender conceitos, mas para
                criar soluções que fazem diferença no mercado.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">+5.000 alunos formados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">+50 cursos disponíveis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">98% de satisfação</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold">Junte-se à nossa missão</h3>
                <p className="text-blue-100 mt-2">
                  Transforme sua carreira em tech
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
