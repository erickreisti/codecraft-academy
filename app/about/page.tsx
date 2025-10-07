import { Header } from "@/components/layout/header"; // Importa componente de cabeçalho

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Container principal ocupando altura mínima da tela */}
      <Header /> {/* Renderiza o componente de cabeçalho */}
      <section className="section-py">
        {/* Seção com padding vertical padrão */}
        <div className="container-custom">
          {/* Container com largura máxima e padding */}

          {/* Hero Sobre - Cabeçalho da página */}
          <div className="text-center mb-16">
            {/* Container centralizado com margem inferior */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {/* Título responsivo */}
              Sobre a <span className="gradient-text">CodeCraft</span>
              {/* Texto com gradiente para destaque */}
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              {/* Parágrafo com cor secundária e largura máxima */}
              Transformando vidas através da educação em tecnologia
            </p>
          </div>

          {/* Conteúdo Principal */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Grid que vira duas colunas em telas grandes */}

            {/* Coluna da Esquerda - Texto e informações */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
              {/* Subtítulo */}

              <p className="text-lg text-muted-foreground mb-6">
                {/* Primeiro parágrafo sobre a missão */}A CodeCraft Academy
                nasceu da paixão por ensinar programação de forma acessível e
                prática. Acreditamos que qualquer pessoa pode aprender a
                programar, independente de sua formação ou experiência anterior.
              </p>

              <p className="text-lg text-muted-foreground mb-6">
                {/* Segundo parágrafo sobre metodologia */}
                Nossa metodologia combina teoria sólida com projetos reais,
                preparando você não apenas para entender conceitos, mas para
                criar soluções que fazem diferença no mercado.
              </p>

              {/* Lista de estatísticas */}
              <div className="space-y-4">
                {/* Container com espaçamento entre itens */}
                <div className="flex items-center gap-3">
                  {/* Item com ícone circular e texto */}
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  {/* Bolinha verde */}
                  <span className="font-medium">+5.000 alunos formados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {/* Bolinha azul */}
                  <span className="font-medium">+50 cursos disponíveis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  {/* Bolinha roxa */}
                  <span className="font-medium">98% de satisfação</span>
                </div>
              </div>
            </div>

            {/* Coluna da Direita - Card de destaque */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white h-64 flex items-center justify-center">
              {/* Card com gradiente azul-roxo */}
              <div className="text-center">
                {/* Conteúdo centralizado dentro do card */}
                <div className="text-4xl mb-4">🚀</div>
                {/* Emoji de foguete */}
                <h3 className="text-2xl font-bold">Junte-se à nossa missão</h3>
                <p className="text-blue-100 mt-2">
                  {/* Texto com cor mais clara para contraste */}
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
