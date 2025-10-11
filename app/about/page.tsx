// app/about/page.tsx - VERSÃO MELHORADA
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Users,
  Award,
  Target,
  Heart,
  Sparkles,
  BookOpen,
  GraduationCap,
  Shield,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    {
      number: "5.000+",
      label: "Alunos Formados",
      icon: <GraduationCap className="h-6 w-6" />,
    },
    {
      number: "50+",
      label: "Cursos Disponíveis",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      number: "98%",
      label: "Taxa de Satisfação",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      number: "4.9",
      label: "Avaliação Média",
      icon: <Award className="h-6 w-6" />,
    },
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Excelência",
      description:
        "Comprometidos com a melhor qualidade em conteúdo, suporte e experiência de aprendizado.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Comunidade",
      description:
        "Acreditamos no poder do aprendizado coletivo e no networking entre alunos e instrutores.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Inovação",
      description:
        "Sempre atualizados com as tecnologias mais modernas e metodologias de ensino eficazes.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Transparência",
      description:
        "Relacionamento honesto e claro com nossos alunos, desde o primeiro contato.",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const team = [
    {
      name: "Equipe de Instrutores",
      role: "Especialistas em Tech",
      description:
        "Profissionais atuantes no mercado com anos de experiência em empresas de tecnologia.",
      emoji: "👨‍💻",
    },
    {
      name: "Mentores",
      role: "Suporte Personalizado",
      description:
        "Dedicados a tirar dúvidas e guiar cada aluno em sua jornada de aprendizado.",
      emoji: "🤝",
    },
    {
      name: "Comunidade",
      role: "Network Ativo",
      description:
        "Milhares de alunos conectados compartilhando conhecimento e oportunidades.",
      emoji: "🌐",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Conheça nossa história
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-8">
              Sobre a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CodeCraft
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Transformando vidas através da educação em tecnologia com cursos
              práticos, mentoria especializada e uma comunidade vibrante
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-28">
            {/* Left Column - Mission */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Nossa Missão
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    A{" "}
                    <strong className="text-foreground">
                      CodeCraft Academy
                    </strong>{" "}
                    nasceu da paixão por ensinar programação de forma acessível,
                    prática e transformadora. Acreditamos que qualquer pessoa,
                    independente de sua formação ou experiência anterior, pode
                    aprender a programar e construir uma carreira de sucesso em
                    tecnologia.
                  </p>
                  <p>
                    Nossa metodologia única combina{" "}
                    <strong className="text-foreground">teoria sólida</strong>{" "}
                    com
                    <strong className="text-foreground"> projetos reais</strong>
                    , preparando você não apenas para entender conceitos, mas
                    para criar soluções inovadoras que fazem diferença no
                    mercado e na sociedade.
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/courses" className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Explorar Cursos
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact" className="flex items-center gap-2">
                    Fale Conosco
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
                </div>

                <div className="relative text-center space-y-6">
                  <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-3xl font-bold">
                      Junte-se à Nossa Missão
                    </h3>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      Faça parte da comunidade que está transformando o futuro
                      da educação em tecnologia
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-60 animate-float"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-60 animate-float-slow"></div>
            </div>
          </div>

          {/* Values Section */}
          <div className="py-16 border-t">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Nossos Valores
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Princípios fundamentais que guiam cada decisão e ação na
                CodeCraft Academy
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl border bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover-lift transition-all duration-300 group"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="py-16 border-t">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Nossa Equipe
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Conheça as pessoas por trás da CodeCraft Academy
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl border bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover-lift transition-all duration-300"
                >
                  <div className="text-5xl mb-6">{member.emoji}</div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {member.name}
                  </h3>
                  <div className="text-primary font-medium mb-4">
                    {member.role}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center py-16 border-t">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Pronto para Começar?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Junte-se a milhares de alunos que já transformaram suas
                carreiras com a CodeCraft Academy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/courses" className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Ver Todos os Cursos
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact" className="flex items-center gap-2">
                    Falar com Consultor
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
