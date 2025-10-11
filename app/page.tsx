/**
 * PÁGINA INICIAL - Hero Section Profissional
 * Design moderno com gradientes, animações e layout otimizado
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
import { Footer } from "@/components/layout/footer";
import {
  Star,
  Users,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Rocket,
  MessageCircle,
  Play,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO SECTION - Design moderno */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>

        <div className="container-custom relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* COLUNA DE CONTEÚDO */}
            <div className="flex-1 space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4 fill-current" />
                  Plataforma de ensino #1 em programação
                </div>

                {/* Título principal */}
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
                  Domine a programação do{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    zero ao profissional
                  </span>
                </h1>

                {/* Descrição */}
                <p className="text-xl text-muted-foreground leading-relaxed max-w-[600px]">
                  Cursos práticos com projetos reais, mentoria especializada e
                  foco nas tecnologias mais demandadas do mercado. Transforme
                  sua carreira em menos de 6 meses.
                </p>
              </div>

              {/* BOTÕES */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Começar Agora
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="py-6 px-8 text-lg border-2 hover:bg-accent hover:scale-105 transition-all duration-300 group"
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Ver Demonstração
                </Button>
              </div>

              {/* ESTATÍSTICAS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      5.000+
                    </div>
                    <div className="text-sm text-muted-foreground">Alunos</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      50+
                    </div>
                    <div className="text-sm text-muted-foreground">Cursos</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      98%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Satisfação
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA VISUAL */}
            <div className="flex-1 flex justify-center animate-fade-in-up">
              <div className="relative w-full max-w-lg">
                {/* Card principal */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-8 text-white shadow-2xl animate-float relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                  </div>

                  <div className="relative text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <div className="text-3xl">💻</div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">CodeCraft Academy</h3>
                      <p className="text-blue-100 text-lg leading-relaxed">
                        Sua jornada em programação começa aqui
                      </p>
                    </div>
                    <div className="pt-4">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">
                          +200 alunos online agora
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elementos decorativos flutuantes */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-60 animate-float-slow"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-60 animate-float-slower"></div>

                {/* Badge de destaque */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                  ⭐ 4.9/5
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container-custom">
          {/* Cabeçalho */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Por que escolher a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeCraft
              </span>
              ?
            </h2>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              Metodologia comprovada que já transformou a carreira de milhares
              de desenvolvedores em todo o Brasil
            </p>
          </div>

          {/* Grid de features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "Aprendizado Prático",
                description:
                  "Projetos reais desde o primeiro dia com tecnologias atuais do mercado. Aprenda fazendo, não apenas ouvindo.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Flexibilidade Total",
                description:
                  "Estude no seu ritmo, de qualquer lugar. Acesso vitalício aos cursos e atualizações gratuitas.",
                color: "from-green-500 to-green-600",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Comunidade Ativa",
                description:
                  "Network com milhares de alunos e instrutores. Tire dúvidas e faça conexões profissionais.",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Certificado Reconhecido",
                description:
                  "Certificados válidos que agregam valor ao seu currículo e comprovam suas habilidades.",
                color: "from-orange-500 to-orange-600",
              },
              {
                icon: <MessageCircle className="h-8 w-8" />,
                title: "Suporte Individual",
                description:
                  "Mentoria personalizada com instrutores experientes para acelerar seu desenvolvimento.",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Garantia de Resultado",
                description:
                  "Metodologia testada e aprovada com 98% de satisfação entre nossos alunos.",
                color: "from-teal-500 to-teal-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover-lift border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-300"
              >
                <CardHeader className="text-center pb-6">
                  <div
                    className={`w-16 h-16 mx-auto bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mt-4">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto space-y-10">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Pronto para transformar sua carreira?
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Junte-se a milhares de alunos que já alcançaram seus objetivos
                em tecnologia e construíram carreiras de sucesso
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 px-10 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <Rocket className="h-6 w-6 mr-3" />
                Começar Agora - 7 Dias Grátis
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="py-6 px-10 text-lg border-2 hover:bg-accent hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar com Especialista
              </Button>
            </div>

            {/* Garantia e benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 justify-center text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>7 dias de garantia</span>
              </div>
              <div className="flex items-center gap-3 justify-center text-sm text-muted-foreground">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Acesso vitalício</span>
              </div>
              <div className="flex items-center gap-3 justify-center text-sm text-muted-foreground">
                <Award className="h-5 w-5 text-purple-500" />
                <span>Certificado inclusivo</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
