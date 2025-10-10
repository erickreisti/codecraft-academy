/**
 * PÁGINA INICIAL - Hero Section Profissional
 * Layout melhorado com alinhamento consistente e espaçamento profissional
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO SECTION - Layout profissional */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* COLUNA DE CONTEÚDO - Alinhada à esquerda */}
            <div className="flex-1 space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                {/* Título principal */}
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                  Aprenda programação do{" "}
                  <span className="gradient-text">zero ao profissional</span>
                </h1>

                {/* Descrição */}
                <p className="text-xl text-muted-foreground leading-relaxed max-w-[600px]">
                  Cursos práticos com projetos reais. Domine as tecnologias mais
                  demandadas do mercado e transforme sua carreira em tech.
                </p>
              </div>

              {/* BOTÕES - Grupo alinhado à esquerda */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button className="gradient-bg hover:opacity-90 text-white font-semibold py-3 px-8 shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-lg">
                  🚀 Explorar Cursos
                </Button>
                <Button
                  variant="outline"
                  className="btn-secondary py-3 px-8 text-lg border-2"
                >
                  👥 Ver Depoimentos
                </Button>
              </div>

              {/* ESTATÍSTICAS - Alinhadas à esquerda */}
              <div className="flex flex-wrap gap-6 pt-8 text-sm text-muted-foreground items-start">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">+5.000 alunos formados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">+50 cursos disponíveis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">98% de satisfação</span>
                </div>
              </div>
            </div>

            {/* COLUNA VISUAL - Centralizada */}
            <div className="flex-1 flex justify-center animate-fade-in-up">
              <div className="relative w-full max-w-lg">
                {/* Card principal com gradiente */}
                <div className="gradient-bg rounded-2xl p-8 text-white shadow-2xl animate-float">
                  <div className="text-center space-y-6">
                    <div className="text-6xl">💻</div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">CodeCraft Academy</h3>
                      <p className="text-blue-100 text-lg">
                        Sua jornada em programação começa aqui
                      </p>
                    </div>
                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">
                          Ao vivo agora
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elementos decorativos */}
                <div
                  className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-float"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-float"
                  style={{ animationDelay: "3s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Layout profissional */}
      <section className="py-20 bg-muted/30">
        <div className="container-custom">
          {/* Cabeçalho centralizado */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Por que escolher a{" "}
              <span className="gradient-text">CodeCraft</span>?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Descubra como nossa metodologia única pode acelerar sua evolução
              na programação
            </p>
          </div>

          {/* Grid de features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="feature-card group">
              <CardHeader className="text-center pb-6">
                <div className="feature-icon group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="text-xl">Aprendizado Prático</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Projetos reais desde o primeiro dia. Não apenas teoria, mas
                  experiência aplicável no mercado de trabalho com tecnologias
                  atuais.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="feature-card group">
              <CardHeader className="text-center pb-6">
                <div className="feature-icon group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🚀</span>
                </div>
                <CardTitle className="text-xl">Carreira Tech</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Foco nas habilidades mais demandadas pelo mercado. Prepare-se
                  para oportunidades reais de emprego com nosso programa de
                  carreira.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="feature-card group">
              <CardHeader className="text-center pb-6">
                <div className="feature-icon group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💡</span>
                </div>
                <CardTitle className="text-xl">
                  Mentoria Especializada
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Suporte de instrutores experientes e comunidade ativa para
                  tirar dúvidas, networking e desenvolvimento profissional
                  contínuo.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Centralizada */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Pronto para transformar sua carreira?
              </h2>
              <p className="text-xl text-muted-foreground">
                Junte-se a milhares de alunos que já alcançaram seus objetivos
                em tech
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gradient-bg hover:opacity-90 text-white font-semibold py-4 px-8 shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-lg">
                🎓 Começar Agora Gratuitamente
              </Button>
              <Button
                variant="outline"
                className="btn-secondary py-4 px-8 text-lg border-2"
              >
                📞 Falar com Consultor
              </Button>
            </div>

            {/* Garantia */}
            <div className="pt-6">
              <div className="inline-flex items-center gap-3 bg-green-50 dark:bg-green-900/20 rounded-full px-6 py-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Garantia de 7 dias ou seu dinheiro de volta
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
