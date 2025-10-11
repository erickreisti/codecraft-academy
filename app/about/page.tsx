// app/about/page.tsx - VERSÃO COM ESPAÇAMENTOS MELHORADOS
import { Header } from "@/components/layout/header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-20 lg:py-28">
        {" "}
        {/* Aumentado o padding */}
        <div className="container-custom">
          {/* Hero Sobre */}
          <div className="text-center mb-20">
            {" "}
            {/* Aumentada margem inferior */}
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {" "}
              {/* Mais espaço no título */}
              Sobre a <span className="gradient-text">CodeCraft</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {" "}
              {/* Leading relaxado */}
              Transformando vidas através da educação em tecnologia
            </p>
          </div>

          {/* Conteúdo Principal */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {" "}
            {/* Gap aumentado */}
            {/* Coluna da Esquerda */}
            <div className="space-y-8">
              {" "}
              {/* Mais espaço entre elementos */}
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Nossa Missão
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  {" "}
                  {/* Texto mais legível */}
                  <p>
                    A CodeCraft Academy nasceu da paixão por ensinar programação
                    de forma acessível e prática. Acreditamos que qualquer
                    pessoa pode aprender a programar, independente de sua
                    formação ou experiência anterior.
                  </p>
                  <p>
                    Nossa metodologia combina teoria sólida com projetos reais,
                    preparando você não apenas para entender conceitos, mas para
                    criar soluções que fazem diferença no mercado.
                  </p>
                </div>
              </div>
              {/* Lista de estatísticas */}
              <div className="space-y-4">
                {" "}
                {/* Mais espaço entre itens */}
                <div className="flex items-center gap-4 py-2">
                  {" "}
                  {/* Padding vertical */}
                  <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="font-medium text-lg">
                    +5.000 alunos formados
                  </span>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="font-medium text-lg">
                    +50 cursos disponíveis
                  </span>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span className="font-medium text-lg">98% de satisfação</span>
                </div>
              </div>
            </div>
            {/* Coluna da Direita */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-10 text-white h-80 flex items-center justify-center">
              {" "}
              {/* Padding aumentado */}
              <div className="text-center space-y-6">
                {" "}
                {/* Mais espaço interno */}
                <div className="text-5xl">🚀</div> {/* Ícone maior */}
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold">
                    Junte-se à nossa missão
                  </h3>
                  <p className="text-blue-100 text-lg">
                    Transforme sua carreira em tech
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Valores */}
          <div className="mt-28 pt-16 border-t">
            {" "}
            {/* Margem top maior + padding + borda */}
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Nossos Valores
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Princípios que guiam tudo o que fazemos
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {" "}
              {/* Gap aumentado */}
              {[
                {
                  icon: "🎯",
                  title: "Excelência",
                  desc: "Buscamos a melhor qualidade em tudo que fazemos",
                },
                {
                  icon: "🤝",
                  title: "Comunidade",
                  desc: "Acreditamos no poder do aprendizado coletivo",
                },
                {
                  icon: "💡",
                  title: "Inovação",
                  desc: "Sempre evoluindo com as tecnologias mais modernas",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl border hover:shadow-lg transition-shadow"
                >
                  {" "}
                  {/* Padding interno aumentado */}
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
