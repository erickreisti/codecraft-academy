// app/page.tsx

/**
 * PÁGINA INICIAL (/) - Primeira impressão da plataforma
 *
 * Esta é a página principal que os usuários veem ao acessar o site
 *
 * Seções implementadas:
 * 1. Hero Section - Chamada principal com título e CTA
 * 2. Features Section - Cards com benefícios e diferenciais
 *
 * Seções futuras (a implementar):
 * - Depoimentos de alunos
 * - Call-to-action final
 * - Footer com links e informações
 *
 * Objetivo de negócio: Converter visitantes em leads/alunos
 * através de uma experiência atraente e convincente
 */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/layout/header"; // Import do Header

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header com navegação e ações do usuário */}
      <Header />

      {/* SEÇÃO HERO - Conteúdo principal de conversão */}
      <section className="container py-24 lg:py-32">
        {/*
          Layout em grid responsivo:
          - 1 coluna no mobile
          - 2 colunas no desktop (lg:)
          - items-center: centraliza verticalmente
          - gap-6: espaçamento entre elementos
        */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          {/* COLUNA DE TEXTO - Conteúdo persuasivo */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              {/* Título principal - Hierarquia tipográfica responsiva */}
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Aprenda programação do zero ao profissional
              </h1>

              {/* Descrição - Texto secundário com cor mais suave */}
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Cursos práticos com projetos reais. Domine as tecnologias mais
                demandadas do mercado e acelere sua carreira.
              </p>
            </div>

            {/* CALL TO ACTION - Botões de conversão principal */}
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              {/* Botão primário - Ação principal */}
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explorar Cursos
              </Button>

              {/* Botão secundário - Ação alternativa */}
              <Button size="lg" variant="outline">
                Ver Depoimentos
              </Button>
            </div>
          </div>

          {/* COLUNA VISUAL - Elemento gráfico (placeholder temporário) */}
          <div className="flex justify-center">
            <div className="w-full max-w-md h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                Hero Visual
                {/*
                  FUTURO: Substituir por:
                  - Ilustração vetorial personalizada
                  - Screenshot da plataforma
                  - Video demonstrativo
                */}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE RECURSOS - Diferenciais e benefícios */}
      <section className="container py-12 lg:py-24">
        {/*
          Grid de cards responsivo:
          - 1 coluna no mobile
          - 3 colunas no desktop (md:)
          - gap-8: espaçamento generoso entre cards
        */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* CARD 1 - Diferencial: Aprendizado Prático */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Aprendizado Prático</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Projetos reais desde o primeiro dia. Não apenas teoria, mas
                experiência aplicável.
              </CardDescription>
            </CardContent>
          </Card>

          {/* CARD 2 - Diferencial: Foco em Carreira */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Carreira Tech</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Foco nas habilidades mais demandadas pelo mercado. Prepare-se
                para oportunidades reais.
              </CardDescription>
            </CardContent>
          </Card>

          {/* CARD 3 - Diferencial: Suporte e Mentoria */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Mentoria Especializada</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Suporte de instrutores experientes e comunidade ativa para tirar
                dúvidas.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
